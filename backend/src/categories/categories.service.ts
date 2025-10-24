import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userRole: UserRole, tenantId?: string) {
    const where: any = {};

    if (userRole !== UserRole.SUPER_ADMIN) {
      where.tenantId = tenantId;
    }

    return this.prisma.category.findMany({
      where,
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, userRole: UserRole, tenantId?: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: { isActive: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (userRole !== UserRole.SUPER_ADMIN && category.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    return category;
  }

  async create(data: { name: string; description?: string; imageUrl?: string }, tenantId: string) {
    return this.prisma.category.create({
      data: {
        ...data,
        tenantId,
      },
    });
  }

  async update(id: string, data: any, userRole: UserRole, tenantId?: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (userRole !== UserRole.SUPER_ADMIN && category.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userRole: UserRole, tenantId?: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (userRole !== UserRole.SUPER_ADMIN && category.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.category.delete({ where: { id } });
  }
}
