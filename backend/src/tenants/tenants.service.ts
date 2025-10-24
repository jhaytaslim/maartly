import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserRole, SubscriptionPlan, SubscriptionStatus } from "@prisma/client";

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userRole: UserRole) {
    if (userRole !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException("Only super admins can view all tenants");
    }

    return this.prisma.tenant.findMany({
      include: {
        _count: {
          select: {
            users: true,
            stores: true,
            products: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findOne(id: string, userRole: UserRole, tenantId?: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      include: {
        stores: true,
        _count: {
          select: {
            users: true,
            products: true,
            orders: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }

    if (userRole !== UserRole.SUPER_ADMIN && tenant.id !== tenantId) {
      throw new ForbiddenException("Access denied");
    }

    return tenant;
  }

  async findBySlug(slug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
      select: {
        id: true,
        businessName: true,
        slug: true,
        logo: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        country: true,
        paystackEnabled: true,
        stripeEnabled: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException("Store not found");
    }

    return {
      ...tenant,
      paymentMethods: {
        paystack: tenant.paystackEnabled || false,
        stripe: tenant.stripeEnabled || false,
      },
    };
  }

  async getStorefrontProducts(slug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }

    const products = await this.prisma.product.findMany({
      where: {
        tenantId: tenant.id,
        isActive: true,
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.sellingPrice,
      image: product.imageUrl,
      // TODO: Add stock when inventory management is implemented
      // stock: product.currentStock,

      category: product.category?.name,
    }));
  }

  async update(
    id: string,
    data: {
      businessName?: string;
      phone?: string;
      address?: string;
      city?: string;
      country?: string;
      logo?: string;
    },
    userRole: UserRole,
    tenantId?: string
  ) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });

    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }

    if (userRole !== UserRole.SUPER_ADMIN && tenant.id !== tenantId) {
      throw new ForbiddenException("Access denied");
    }

    return this.prisma.tenant.update({
      where: { id },
      data,
    });
  }

  async updateSubscription(
    id: string,
    data: {
      subscriptionPlan?: SubscriptionPlan;
      subscriptionStatus?: SubscriptionStatus;
      maxStores?: number;
      maxProducts?: number;
      maxUsers?: number;
    },
    userRole: UserRole
  ) {
    if (userRole !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException(
        "Only super admins can update subscriptions"
      );
    }

    return this.prisma.tenant.update({
      where: { id },
      data,
    });
  }

  async getStats(tenantId: string) {
    const [tenant, stores, products, users, orders] = await Promise.all([
      this.prisma.tenant.findUnique({ where: { id: tenantId } }),
      this.prisma.store.count({ where: { tenantId } }),
      this.prisma.product.count({ where: { tenantId } }),
      this.prisma.user.count({ where: { tenantId } }),
      this.prisma.order.count({ where: { tenantId } }),
    ]);

    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }

    return {
      businessName: tenant.businessName,
      subscriptionPlan: tenant.subscriptionPlan,
      subscriptionStatus: tenant.subscriptionStatus,
      limits: {
        maxStores: tenant.maxStores,
        maxProducts: tenant.maxProducts,
        maxUsers: tenant.maxUsers,
      },
      usage: {
        stores,
        products,
        users,
        orders,
      },
    };
  }
}
