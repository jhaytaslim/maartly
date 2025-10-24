import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateCustomerDto {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  address?: string;
  city?: string;
  tenantId: string;
}

export interface UpdateCustomerDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
}

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: dto,
    });
  }

  async findAll(tenantId: string, search?: string) {
    const where: any = { tenantId };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.customer.findMany({
      where,
      include: {
        _count: {
          select: {
            orders: true,
            debts: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        orders: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            store: {
              select: {
                name: true,
              },
            },
          },
        },
        debts: {
          where: { isSettled: false },
        },
        _count: {
          select: {
            orders: true,
            debts: true,
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    await this.findOne(id);

    return this.prisma.customer.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    const customer = await this.findOne(id);

    // Check if customer has orders or debts
    if (customer._count.orders > 0 || customer._count.debts > 0) {
      throw new Error('Cannot delete customer with existing orders or debts');
    }

    return this.prisma.customer.delete({
      where: { id },
    });
  }

  async getStatistics(tenantId: string) {
    const [total, withOrders, withDebts] = await Promise.all([
      this.prisma.customer.count({ where: { tenantId } }),
      this.prisma.customer.count({
        where: {
          tenantId,
          orders: {
            some: {},
          },
        },
      }),
      this.prisma.customer.count({
        where: {
          tenantId,
          debts: {
            some: { isSettled: false },
          },
        },
      }),
    ]);

    return {
      total,
      withOrders,
      withDebts,
    };
  }
}
