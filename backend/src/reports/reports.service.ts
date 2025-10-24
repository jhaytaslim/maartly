import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { OrderStatus } from "@prisma/client";

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardSummary(tenantId: string, storeId?: string) {
    const where: any = { tenantId };
    if (storeId) {
      where.storeId = storeId;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisWeekStart = new Date();
    thisWeekStart.setDate(today.getDate() - today.getDay());
    thisWeekStart.setHours(0, 0, 0, 0);

    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // Sales statistics
    const [
      todaySales,
      weekSales,
      monthSales,
      totalProducts,
      lowStockProducts,
      activeCustomers,
      pendingDebts,
    ] = await Promise.all([
      // Today's sales
      this.prisma.order.aggregate({
        where: {
          ...where,
          status: OrderStatus.COMPLETED,
          createdAt: { gte: today },
        },
        _sum: { totalAmount: true },
        _count: true,
      }),
      // This week's sales
      this.prisma.order.aggregate({
        where: {
          ...where,
          status: OrderStatus.COMPLETED,
          createdAt: { gte: thisWeekStart },
        },
        _sum: { totalAmount: true },
        _count: true,
      }),
      // This month's sales
      this.prisma.order.aggregate({
        where: {
          ...where,
          status: OrderStatus.COMPLETED,
          createdAt: { gte: thisMonthStart },
        },
        _sum: { totalAmount: true },
        _count: true,
      }),
      // Total products
      this.prisma.product.count({
        where: { tenantId, isActive: true },
      }),
      // Low stock products
      this.getLowStockCount(tenantId, storeId),
      // Active customers (with orders in last 30 days)
      this.prisma.customer.count({
        where: {
          tenantId,
          orders: {
            some: {
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              },
            },
          },
        },
      }),
      // Pending debts
      this.prisma.debt.aggregate({
        where: {
          tenantId,
          isSettled: false,
        },
        _sum: { remainingAmount: true },
        _count: true,
      }),
    ]);

    return {
      sales: {
        today: {
          amount: todaySales._sum.totalAmount || 0,
          count: todaySales._count,
        },
        week: {
          amount: weekSales._sum.totalAmount || 0,
          count: weekSales._count,
        },
        month: {
          amount: monthSales._sum.totalAmount || 0,
          count: monthSales._count,
        },
      },
      inventory: {
        totalProducts,
        lowStockProducts,
      },
      customers: {
        active: activeCustomers,
      },
      debts: {
        count: pendingDebts._count,
        amount: pendingDebts._sum.remainingAmount || 0,
      },
    };
  }

  async getDailySalesReport(tenantId: string, date: Date, storeId?: string) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const where: any = {
      tenantId,
      status: OrderStatus.COMPLETED,
      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    };

    if (storeId) {
      where.storeId = storeId;
    }

    const [orders, summary, topProducts] = await Promise.all([
      this.prisma.order.findMany({
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
          items: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.order.aggregate({
        where,
        _sum: {
          totalAmount: true,
          taxAmount: true,
          discountAmount: true,
        },
        _count: true,
      }),
      this.getTopSellingProducts(tenantId, startOfDay, endOfDay, storeId, 10),
    ]);

    return {
      date: date.toISOString().split("T")[0],
      summary: {
        totalSales: summary._sum.totalAmount || 0,
        totalTax: summary._sum.taxAmount || 0,
        totalDiscount: summary._sum.discountAmount || 0,
        orderCount: summary._count,
      },
      orders,
      topProducts,
    };
  }

  async getWeeklySalesReport(
    tenantId: string,
    weekStart: Date,
    storeId?: string
  ) {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const where: any = {
      tenantId,
      status: OrderStatus.COMPLETED,
      createdAt: {
        gte: weekStart,
        lt: weekEnd,
      },
    };

    if (storeId) {
      where.storeId = storeId;
    }

    // Get daily breakdown
    const dailyBreakdown = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);

      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);

      const daySummary = await this.prisma.order.aggregate({
        where: {
          ...where,
          createdAt: {
            gte: dayStart,
            lte: dayEnd,
          },
        },
        _sum: { totalAmount: true },
        _count: true,
      });

      dailyBreakdown.push({
        date: day.toISOString().split("T")[0],
        dayName: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ][day.getDay()],
        sales: daySummary._sum.totalAmount || 0,
        orders: daySummary._count,
      });
    }

    const [summary, topProducts] = await Promise.all([
      this.prisma.order.aggregate({
        where,
        _sum: {
          totalAmount: true,
          taxAmount: true,
          discountAmount: true,
        },
        _count: true,
      }),
      this.getTopSellingProducts(tenantId, weekStart, weekEnd, storeId, 10),
    ]);

    return {
      period: {
        start: weekStart.toISOString().split("T")[0],
        end: weekEnd.toISOString().split("T")[0],
      },
      summary: {
        totalSales: summary._sum.totalAmount || 0,
        totalTax: summary._sum.taxAmount || 0,
        totalDiscount: summary._sum.discountAmount || 0,
        orderCount: summary._count,
        averageOrderValue:
          summary._count > 0
            ? (summary._sum.totalAmount || 0) / summary._count
            : 0,
      },
      dailyBreakdown,
      topProducts,
    };
  }

  async getInventoryReport(tenantId: string, storeId?: string) {
    const where: any = {};
    if (storeId) {
      where.storeId = storeId;
    }

    const inventory = await this.prisma.inventory.findMany({
      where: {
        ...where,
        product: {
          where: { tenantId },
        },
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
        store: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        quantity: "asc",
      },
    });

    const lowStock = inventory.filter(
      (item) => item.quantity <= item.product.lowStockThreshold
    );

    const outOfStock = inventory.filter((item) => item.quantity === 0);

    const totalValue = inventory.reduce(
      (sum, item) => sum + item.quantity * item.product.costPrice,
      0
    );

    return {
      summary: {
        totalItems: inventory.length,
        lowStockItems: lowStock.length,
        outOfStockItems: outOfStock.length,
        totalValue,
      },
      lowStock,
      outOfStock,
      inventory,
    };
  }

  private async getLowStockCount(
    tenantId: string,
    storeId?: string
  ): Promise<number> {
    const where: any = {
      product: {
        tenantId,
        isActive: true,
      },
    };

    if (storeId) {
      where.storeId = storeId;
    }

    const inventoryItems = await this.prisma.inventory.findMany({
      where,
      include: {
        product: {
          select: {
            lowStockThreshold: true,
          },
        },
      },
    });

    return inventoryItems.filter(
      (item) => item.quantity <= item.product.lowStockThreshold
    ).length;
  }

  private async getTopSellingProducts(
    tenantId: string,
    startDate: Date,
    endDate: Date,
    storeId?: string,
    limit = 10
  ) {
    const where: any = {
      order: {
        tenantId,
        status: OrderStatus.COMPLETED,
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
    };

    if (storeId) {
      where.order.storeId = storeId;
    }

    const orderItems = await this.prisma.orderItem.findMany({
      where,
      include: {
        product: true,
      },
    });

    // Group by product and sum quantities
    const productSales = orderItems.reduce(
      (acc, item) => {
        if (!acc[item.productId]) {
          acc[item.productId] = {
            product: item.product,
            quantity: 0,
            revenue: 0,
          };
        }
        acc[item.productId].quantity += item.quantity;
        acc[item.productId].revenue += item.subtotal;
        return acc;
      },
      {} as Record<string, any>
    );

    return Object.values(productSales)
      .sort((a: any, b: any) => b.quantity - a.quantity)
      .slice(0, limit);
  }
}
