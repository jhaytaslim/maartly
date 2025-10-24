import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { RabbitMQService, EventMessage } from '../rabbitmq/rabbitmq.service';
import { EventStatus } from '@prisma/client';
import { getErrorMessage } from '../common/utils';

@Injectable()
export class OutboxService {
  private readonly logger = new Logger(OutboxService.name);
  private readonly MAX_RETRIES = 5;

  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbitMQ: RabbitMQService,
  ) {}

  /**
   * Create an outbox event for eventual consistency
   */
  async createEvent(
    tenantId: string,
    aggregateId: string,
    aggregateType: string,
    eventType: string,
    payload: any,
  ): Promise<void> {
    try {
      await this.prisma.outboxEvent.create({
        data: {
          tenantId,
          aggregateId,
          aggregateType,
          eventType,
          payload: JSON.stringify(payload),
          status: EventStatus.PENDING,
        },
      });

      this.logger.debug(`Created outbox event: ${aggregateType}.${eventType} for ${aggregateId}`);
    } catch (error) {
      this.logger.error('Failed to create outbox event:', error);
      throw error;
    }
  }

  /**
   * Process pending outbox events
   * Runs every 10 seconds
   */
  @Cron(CronExpression.EVERY_10_SECONDS)
  async processOutboxEvents(): Promise<void> {
    try {
      const pendingEvents = await this.prisma.outboxEvent.findMany({
        where: {
          status: EventStatus.PENDING,
          retryCount: {
            lt: this.MAX_RETRIES,
          },
        },
        take: 100,
        orderBy: {
          createdAt: 'asc',
        },
      });

      if (pendingEvents.length === 0) {
        return;
      }

      this.logger.log(`Processing ${pendingEvents.length} outbox events`);

      for (const event of pendingEvents) {
        await this.processEvent(event);
      }
    } catch (error) {
      this.logger.error('Error processing outbox events:', error);
    }
  }

  private async processEvent(event: any): Promise<void> {
    try {
      // Mark as processing
      await this.prisma.outboxEvent.update({
        where: { id: event.id },
        data: {
          status: EventStatus.PROCESSING,
        },
      });

      // Parse payload
      const payload = JSON.parse(event.payload);

      // Create event message
      const eventMessage: EventMessage = {
        tenantId: event.tenantId,
        aggregateId: event.aggregateId,
        aggregateType: event.aggregateType,
        eventType: event.eventType,
        payload,
        timestamp: event.createdAt,
      };

      // Publish to RabbitMQ
      const routingKey = `${event.aggregateType.toLowerCase()}.${event.eventType}`;
      await this.rabbitMQ.publishEvent(routingKey, eventMessage);

      // Mark as completed
      await this.prisma.outboxEvent.update({
        where: { id: event.id },
        data: {
          status: EventStatus.COMPLETED,
          processedAt: new Date(),
        },
      });

      this.logger.debug(`Successfully processed event: ${event.id}`);
    } catch (error) {
      this.logger.error(`Failed to process event: ${event.id}`, error);

      // Update retry count and status
      await this.prisma.outboxEvent.update({
        where: { id: event.id },
        data: {
          status: event.retryCount + 1 >= this.MAX_RETRIES ? EventStatus.FAILED : EventStatus.PENDING,
          retryCount: {
            increment: 1,
          },
          errorMessage: getErrorMessage(error),
        },
      });
    }
  }

  /**
   * Cleanup old completed events
   * Runs daily
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async cleanupOldEvents(): Promise<void> {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const result = await this.prisma.outboxEvent.deleteMany({
        where: {
          status: EventStatus.COMPLETED,
          processedAt: {
            lt: sevenDaysAgo,
          },
        },
      });

      this.logger.log(`Cleaned up ${result.count} old outbox events`);
    } catch (error) {
      this.logger.error('Error cleaning up old events:', error);
    }
  }
}
