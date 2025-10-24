import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateDebtDto {
  customerId: string;
  cashierId: string;
  tenantId: string;
  totalAmount: number;
  paidAmount?: number;
  currency: string;
  dueDate?: Date;
  notes?: string;
}

export interface RecordPaymentDto {
  amount: number;
  paymentMethod: string;
  receivedById: string;
  notes?: string;
}

@Injectable()
export class DebtsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDebtDto) {
    const paidAmount = dto.paidAmount || 0;
    const remainingAmount = dto.totalAmount - paidAmount;

    // Generate debt number
    const count = await this.prisma.debt.count({
      where: { tenantId: dto.tenantId },
    });
    const debtNumber = `DEBT-${String(count + 1).padStart(6, '0')}`;

    return this.prisma.debt.create({
      data: {
        debtNumber,
        customerId: dto.customerId,
        cashierId: dto.cashierId,
        tenantId: dto.tenantId,
        totalAmount: dto.totalAmount,
        paidAmount,
        remainingAmount,
        currency: dto.currency,
        dueDate: dto.dueDate,
        notes: dto.notes,
        isSettled: remainingAmount === 0,
        settledAt: remainingAmount === 0 ? new Date() : null,
      },
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
      },
    });
  }

  async findAll(tenantId: string, filters?: {
    customerId?: string;
    isSettled?: boolean;
    overdue?: boolean;
  }) {
    const where: any = { tenantId };

    if (filters?.customerId) {
      where.customerId = filters.customerId;
    }

    if (filters?.isSettled !== undefined) {
      where.isSettled = filters.isSettled;
    }

    if (filters?.overdue) {
      where.isSettled = false;
      where.dueDate = {
        lt: new Date(),
      };
    }

    return this.prisma.debt.findMany({
      where,
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
        payments: {
          include: {
            receivedBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const debt = await this.prisma.debt.findUnique({
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
        payments: {
          include: {
            receivedBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!debt) {
      throw new NotFoundException('Debt not found');
    }

    return debt;
  }

  async recordPayment(debtId: string, dto: RecordPaymentDto) {
    const debt = await this.findOne(debtId);

    if (debt.isSettled) {
      throw new BadRequestException('Debt is already settled');
    }

    if (dto.amount <= 0) {
      throw new BadRequestException('Payment amount must be greater than zero');
    }

    if (dto.amount > debt.remainingAmount) {
      throw new BadRequestException('Payment amount exceeds remaining debt');
    }

    const newPaidAmount = debt.paidAmount + dto.amount;
    const newRemainingAmount = debt.totalAmount - newPaidAmount;
    const isSettled = newRemainingAmount === 0;

    // Generate receipt number
    const paymentCount = await this.prisma.debtPayment.count({
      where: { debtId },
    });
    const receiptNumber = `${debt.debtNumber}-P${String(paymentCount + 1).padStart(3, '0')}`;

    // Create payment and update debt in a transaction
    return this.prisma.$transaction(async (tx) => {
      // Create payment record
      await tx.debtPayment.create({
        data: {
          debtId,
          amount: dto.amount,
          paymentMethod: dto.paymentMethod,
          receivedById: dto.receivedById,
          notes: dto.notes,
          receiptNumber,
        },
      });

      // Update debt
      return tx.debt.update({
        where: { id: debtId },
        data: {
          paidAmount: newPaidAmount,
          remainingAmount: newRemainingAmount,
          isSettled,
          settledAt: isSettled ? new Date() : null,
        },
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
          payments: {
            include: {
              receivedBy: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });
    });
  }

  async getStatistics(tenantId: string) {
    const [total, settled, overdue, totalAmount, remainingAmount] = await Promise.all([
      this.prisma.debt.count({ where: { tenantId } }),
      this.prisma.debt.count({ where: { tenantId, isSettled: true } }),
      this.prisma.debt.count({
        where: {
          tenantId,
          isSettled: false,
          dueDate: { lt: new Date() },
        },
      }),
      this.prisma.debt.aggregate({
        where: { tenantId },
        _sum: { totalAmount: true },
      }),
      this.prisma.debt.aggregate({
        where: { tenantId, isSettled: false },
        _sum: { remainingAmount: true },
      }),
    ]);

    return {
      total,
      settled,
      pending: total - settled,
      overdue,
      totalAmount: totalAmount._sum.totalAmount || 0,
      remainingAmount: remainingAmount._sum.remainingAmount || 0,
    };
  }

  async delete(id: string) {
    const debt = await this.findOne(id);

    if (debt.paidAmount > 0) {
      throw new BadRequestException('Cannot delete debt with recorded payments');
    }

    return this.prisma.debt.delete({
      where: { id },
    });
  }
}
