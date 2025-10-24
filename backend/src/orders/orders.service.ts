import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OutboxService } from '../events/outbox.service';
import { OrderStatus, PaymentStatus } from '@prisma/client';

export interface CreateOrderDto {
  customerId?: string;
  cashierId: string;
  storeId: string;
  tenantId: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
    discount?: number;
  }>;
  paymentMethod: string;
  discountAmount?: number;
  notes?: string;
  currency: string;
  offlineId?: string; // For offline orders
}

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly outbox: OutboxService,
  ) {}

  async create(dto: CreateOrderDto) {
    // Generate order number
    const count = await this.prisma.order.count({
      where: { tenantId: dto.tenantId },
    });
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;

    // Calculate totals
    let subtotal = 0;
    let taxAmount = 0;

    const orderItems = dto.items.map(item => {
      const itemSubtotal = item.quantity * item.unitPrice - (item.discount || 0);
      const itemTax = itemSubtotal * ((item.taxRate || 0) / 100);
      
      subtotal += itemSubtotal;
      taxAmount += itemTax;

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxRate: item.taxRate || 0,
        discount: item.discount || 0,
        subtotal: itemSubtotal,
      };
    });

    const totalAmount = subtotal + taxAmount - (dto.discountAmount || 0);

    // Create order with items in a transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: dto.customerId,
          cashierId: dto.cashierId,
          storeId: dto.storeId,
          tenantId: dto.tenantId,
          subtotal,
          taxAmount,
          discountAmount: dto.discountAmount || 0,
          totalAmount,
          currency: dto.currency,
          paymentMethod: dto.paymentMethod,
          paymentStatus: PaymentStatus.COMPLETED,
          status: OrderStatus.COMPLETED,
          notes: dto.notes,
          offlineId: dto.offlineId,
          syncedAt: dto.offlineId ? new Date() : null,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          customer: true,
          cashier: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          store: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Update inventory for each item
      for (const item of dto.items) {
        const inventory = await tx.inventory.findFirst({
          where: {
            productId: item.productId,
            storeId: dto.storeId,
          },
        });

        if (!inventory || inventory.quantity < item.quantity) {
          throw new BadRequestException(`Insufficient stock for product ${item.productId}`);
        }

        await tx.inventory.update({
          where: { id: inventory.id },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });

        // Create outbox event for stock change
        await this.outbox.createEvent(
          dto.tenantId,
          item.productId,
          'inventory',
          'stock.changed',
          {
            productId: item.productId,
            storeId: dto.storeId,
            quantity: inventory.quantity - item.quantity,
            change: -item.quantity,
            reason: 'sale',
            orderId: newOrder.id,
          }
        );
      }

      // Update customer total purchases if customer exists
      if (dto.customerId) {
        await tx.customer.update({
          where: { id: dto.customerId },
          data: {
            totalPurchases: {
              increment: totalAmount,
            },
          },
        });
      }

      return newOrder;
    });

    // Create outbox event for order creation
    await this.outbox.createEvent(
      dto.tenantId,
      order.id,
      'order',
      'created',
      {
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalAmount,
        storeId: dto.storeId,
        customerId: dto.customerId,
      }
    );

    return order;
  }

  async findAll(tenantId: string, filters?: {
    storeId?: string;
    customerId?: string;
    status?: OrderStatus;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where: any = { tenantId };

    if (filters?.storeId) {
      where.storeId = filters.storeId;
    }

    if (filters?.customerId) {
      where.customerId = filters.customerId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    return this.prisma.order.findMany({
      where,
      include: {
        customer: true,
        cashier: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        store: {
          select: {
            id: true,
            name: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        cashier: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        store: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async cancel(id: string) {
    const order = await this.findOne(id);

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Order is already cancelled');
    }

    // Revert inventory in a transaction
    const updatedOrder = await this.prisma.$transaction(async (tx) => {
      // Restore inventory
      for (const item of order.items) {
        const inventory = await tx.inventory.findFirst({
          where: {
            productId: item.productId,
            storeId: order.storeId,
          },
        });

        if (inventory) {
          await tx.inventory.update({
            where: { id: inventory.id },
            data: {
              quantity: {
                increment: item.quantity,
              },
            },
          });
        }
      }

      // Update order status
      return tx.order.update({
        where: { id },
        data: {
          status: OrderStatus.CANCELLED,
          paymentStatus: PaymentStatus.REFUNDED,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    // Create outbox event
    await this.outbox.createEvent(
      order.tenantId,
      id,
      'order',
      'cancelled',
      {
        orderId: id,
        orderNumber: order.orderNumber,
      }
    );

    return updatedOrder;
  }

  async getStatistics(tenantId: string, storeId?: string) {
    const where: any = { tenantId };
    if (storeId) {
      where.storeId = storeId;
    }

    const [total, completed, pending, totalRevenue] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.count({ where: { ...where, status: OrderStatus.COMPLETED } }),
      this.prisma.order.count({ where: { ...where, status: OrderStatus.PENDING } }),
      this.prisma.order.aggregate({
        where: { ...where, status: OrderStatus.COMPLETED },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      total,
      completed,
      pending,
      cancelled: await this.prisma.order.count({ where: { ...where, status: OrderStatus.CANCELLED } }),
      totalRevenue: totalRevenue._sum.totalAmount || 0,
    };
  }
}
