import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async findAll(userRole: UserRole, tenantId?: string) {
    const where: any = {};

    if (userRole === UserRole.SUPER_ADMIN) {
      // Can see all suppliers
    } else {
      where.tenantId = tenantId;
    }

    return this.prisma.supplier.findMany({
      where,
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, userRole: UserRole, tenantId?: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            sku: true,
          },
        },
      },
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    if (userRole !== UserRole.SUPER_ADMIN && supplier.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    return supplier;
  }

  async create(data: any, tenantId: string) {
    return this.prisma.supplier.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  async update(id: string, data: any, userRole: UserRole, tenantId?: string) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    if (userRole !== UserRole.SUPER_ADMIN && supplier.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.supplier.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userRole: UserRole, tenantId?: string) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    if (userRole !== UserRole.SUPER_ADMIN && supplier.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.supplier.delete({
      where: { id },
    });

    return { message: 'Supplier deleted successfully' };
  }
}
