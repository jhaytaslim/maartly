import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async findAll(userRole: UserRole, tenantId?: string) {
    const where: any = {};

    if (userRole === UserRole.SUPER_ADMIN) {
      // Can see all stores
    } else if (userRole === UserRole.TENANT_ADMIN) {
      where.tenantId = tenantId;
    } else {
      throw new ForbiddenException('Insufficient permissions');
    }

    return this.prisma.store.findMany({
      where,
      include: {
        tenant: {
          select: {
            id: true,
            businessName: true,
          },
        },
        _count: {
          select: {
            users: true,
            inventory: true,
            orders: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userRole: UserRole, tenantId?: string) {
    const store = await this.prisma.store.findUnique({
      where: { id },
      include: {
        tenant: true,
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        _count: {
          select: {
            inventory: true,
            orders: true,
          },
        },
      },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    if (userRole !== UserRole.SUPER_ADMIN && store.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    return store;
  }

  async create(data: any, tenantId: string) {
    // Check tenant store limit
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }
    
    if (tenant.currentStoreCount >= tenant.maxStores) {
      throw new BadRequestException('Store limit reached for your plan');
    }

    const store = await this.prisma.store.create({
      data: {
        ...data,
        tenantId,
      },
      include: {
        tenant: {
          select: {
            id: true,
            businessName: true,
          },
        },
      },
    });

    // Update tenant store count
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        currentStoreCount: {
          increment: 1,
        },
      },
    });

    return store;
  }

  async update(id: string, data: any, userRole: UserRole, tenantId?: string) {
    const store = await this.prisma.store.findUnique({ where: { id } });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    if (userRole !== UserRole.SUPER_ADMIN && store.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.store.update({
      where: { id },
      data,
      include: {
        tenant: {
          select: {
            id: true,
            businessName: true,
          },
        },
      },
    });
  }

  async delete(id: string, userRole: UserRole, tenantId?: string) {
    const store = await this.prisma.store.findUnique({ where: { id } });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    if (userRole !== UserRole.SUPER_ADMIN && store.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    // Soft delete - deactivate
    await this.prisma.store.update({
      where: { id },
      data: { isActive: false },
    });

    // Update tenant store count
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        currentStoreCount: {
          decrement: 1,
        },
      },
    });

    return { message: 'Store deactivated successfully' };
  }
}
