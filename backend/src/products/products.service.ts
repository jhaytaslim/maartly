import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userRole: UserRole, tenantId?: string, storeId?: string) {
    const where: any = {};

    if (userRole === UserRole.SUPER_ADMIN) {
      // Can see all products
    } else if (userRole === UserRole.TENANT_ADMIN) {
      where.tenantId = tenantId;
    } else if (userRole === UserRole.STORE_MANAGER || userRole === UserRole.CASHIER) {
      where.tenantId = tenantId;
      where.inventory = {
        some: {
          storeId: storeId,
        },
      };
    }

    return this.prisma.product.findMany({
      where,
      include: {
        category: true,
        supplier: true,
        inventory: storeId
          ? {
              where: { storeId },
            }
          : true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userRole: UserRole, tenantId?: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        supplier: true,
        inventory: {
          include: {
            store: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (userRole !== UserRole.SUPER_ADMIN && product.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    return product;
  }

  async create(data: any, tenantId: string) {
    // Check if SKU exists
    if (data.sku) {
      const existing = await this.prisma.product.findUnique({
        where: { sku: data.sku },
      });
      if (existing) {
        throw new BadRequestException('SKU already exists');
      }
    }

    // Check tenant product limit
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }
    
    if (tenant.currentProductCount >= tenant.maxProducts) {
      throw new BadRequestException('Product limit reached for your plan');
    }

    const product = await this.prisma.product.create({
      data: {
        ...data,
        tenantId,
      },
      include: {
        category: true,
        supplier: true,
      },
    });

    // Update tenant product count
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        currentProductCount: {
          increment: 1,
        },
      },
    });

    return product;
  }

  async update(
    id: string,
    data: any,
    userRole: UserRole,
    tenantId?: string,
  ) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (userRole !== UserRole.SUPER_ADMIN && product.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        supplier: true,
      },
    });
  }

  async delete(id: string, userRole: UserRole, tenantId?: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (userRole !== UserRole.SUPER_ADMIN && product.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    // Update tenant product count
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        currentProductCount: {
          decrement: 1,
        },
      },
    });

    return { message: 'Product deleted successfully' };
  }

  async search(query: string, tenantId: string) {
    return this.prisma.product.findMany({
      where: {
        tenantId,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } },
          { barcode: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        category: true,
        inventory: true,
      },
      take: 20,
    });
  }
}
