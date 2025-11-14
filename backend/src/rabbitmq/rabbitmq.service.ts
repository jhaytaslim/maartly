import { getErrorMessage } from "@/common/utils";
import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from "@nestjs/common";
import amqp, { ChannelModel, connect } from "amqplib";

export interface EventMessage {
  tenantId: string;
  aggregateId: string;
  aggregateType: string;
  eventType: string;
  payload: any;
  timestamp: Date;
}

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RabbitMQService.name);
  private connection: ChannelModel | null = null;
  private channel: amqp.Channel | null = null;
  private readonly exchangeName = "maartly.events";
  private readonly dlxExchangeName = "maartly.dlx";

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect(): Promise<void> {
    try {
      const rabbitMQUrl = process.env.RABBITMQ_URL || "amqp://localhost:15672";
      this.connection = await connect(rabbitMQUrl);
      this.channel = await this.connection.createChannel();

      // Create main exchange
      await this.channel.assertExchange(this.exchangeName, "topic", {
        durable: true,
      });

      // Create Dead Letter Exchange
      await this.channel.assertExchange(this.dlxExchangeName, "topic", {
        durable: true,
      });

      this.logger.log("Successfully connected to RabbitMQ");
    } catch (error) {
      this.logger.warn(
        "RabbitMQ connection failed, operating in fallback mode:",
        getErrorMessage(error)
      );
      // System can still operate without RabbitMQ, events will be processed via outbox pattern
    }
  }

  private async disconnect(): Promise<void> {
    try {
      await this.channel?.close();
      await this.connection?.close();
      this.logger.log("Disconnected from RabbitMQ");
    } catch (error) {
      this.logger.error("Error disconnecting from RabbitMQ:", error);
    }
  }

  async publishEvent(routingKey: string, event: EventMessage): Promise<void> {
    if (!this.channel) {
      this.logger.warn(
        "RabbitMQ not available, event will be handled by outbox processor"
      );
      return;
    }

    try {
      const message = JSON.stringify(event);
      this.channel.publish(
        this.exchangeName,
        routingKey,
        Buffer.from(message),
        {
          persistent: true,
          contentType: "application/json",
          timestamp: Date.now(),
        }
      );

      this.logger.debug(`Published event: ${routingKey}`, event);
    } catch (error) {
      this.logger.error(`Failed to publish event: ${routingKey}`, error);
      throw error;
    }
  }

  async subscribeToEvents(
    queueName: string,
    routingKeys: string[],
    handler: (event: EventMessage) => Promise<void>
  ): Promise<void> {
    if (!this.channel) {
      this.logger.warn("RabbitMQ not available, cannot subscribe to events");
      return;
    }

    try {
      // Assert queue with DLX configuration
      await this.channel.assertQueue(queueName, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": this.dlxExchangeName,
          "x-dead-letter-routing-key": `${queueName}.failed`,
        },
      });

      // Bind queue to routing keys
      for (const routingKey of routingKeys) {
        await this.channel.bindQueue(queueName, this.exchangeName, routingKey);
      }

      // Consume messages
      await this.channel.consume(
        queueName,
        async (msg: any) => {
          if (!msg) return;

          try {
            const event: EventMessage = JSON.parse(msg.content.toString());
            await handler(event);
            this.channel!.ack(msg);
          } catch (error) {
            this.logger.error(
              `Error processing message from ${queueName}:`,
              error
            );
            // Reject and requeue or send to DLX based on retry count
            this.channel!.nack(msg, false, false); // Send to DLX
          }
        },
        { noAck: false }
      );

      this.logger.log(
        `Subscribed to queue: ${queueName} with routing keys: ${routingKeys.join(", ")}`
      );
    } catch (error) {
      this.logger.error(`Failed to subscribe to queue: ${queueName}`, error);
      throw error;
    }
  }

  // Common routing keys
  static readonly RoutingKeys = {
    // Product events
    PRODUCT_CREATED: "product.created",
    PRODUCT_UPDATED: "product.updated",
    PRODUCT_DELETED: "product.deleted",

    // Inventory events
    STOCK_CHANGED: "inventory.stock.changed",
    STOCK_LOW: "inventory.stock.low",
    STOCK_OUT: "inventory.stock.out",

    // Order events
    ORDER_CREATED: "order.created",
    ORDER_COMPLETED: "order.completed",
    ORDER_CANCELLED: "order.cancelled",

    // Transfer events
    TRANSFER_CREATED: "transfer.created",
    TRANSFER_APPROVED: "transfer.approved",
    TRANSFER_COMPLETED: "transfer.completed",

    // Sync events
    CATALOG_SYNC: "catalog.sync.#",
  };
}
