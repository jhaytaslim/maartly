#!/bin/bash

# This script creates all missing backend modules for Martly
# Run this from the backend directory: bash CREATE_ALL_MODULES.sh

echo "🚀 Creating all Martly backend modules..."

# Create Stores Module
echo "📦 Creating Stores Module..."
mkdir -p src/stores

cat > src/stores/stores.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { StoresService } from './stores.service';
import { StoresController } from './stores.controller';

@Module({
  controllers: [StoresController],
  providers: [StoresService],
  exports: [StoresService],
})
export class StoresModule {}
EOF

cat > src/stores/stores.service.ts << 'EOF'
import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async findAll(userRole: UserRole, tenantId?: string) {
    const where: any = {};
    if (userRole !== UserRole.SUPER_ADMIN) {
      where.tenantId = tenantId;
    }

    return this.prisma.store.findMany({
      where,
      include: {
        _count: { select: { users: true, inventory: true, orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userRole: UserRole, tenantId?: string) {
    const store = await this.prisma.store.findUnique({
      where: { id },
      include: {
        users: true,
        _count: { select: { inventory: true, orders: true } },
      },
    });

    if (!store) throw new NotFoundException('Store not found');
    if (userRole !== UserRole.SUPER_ADMIN && store.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    return store;
  }

  async create(data: any, tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (tenant.currentStoreCount >= tenant.maxStores) {
      throw new BadRequestException('Store limit reached for your plan');
    }

    const store = await this.prisma.store.create({
      data: { ...data, tenantId },
    });

    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { currentStoreCount: { increment: 1 } },
    });

    return store;
  }

  async update(id: string, data: any, userRole: UserRole, tenantId?: string) {
    const store = await this.prisma.store.findUnique({ where: { id } });
    if (!store) throw new NotFoundException('Store not found');
    if (userRole !== UserRole.SUPER_ADMIN && store.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.store.update({ where: { id }, data });
  }

  async delete(id: string, userRole: UserRole, tenantId?: string) {
    const store = await this.prisma.store.findUnique({ where: { id } });
    if (!store) throw new NotFoundException('Store not found');
    if (userRole !== UserRole.SUPER_ADMIN && store.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.store.update({ where: { id }, data: { isActive: false } });
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { currentStoreCount: { decrement: 1 } },
    });

    return { message: 'Store deactivated successfully' };
  }
}
EOF

cat > src/stores/stores.controller.ts << 'EOF'
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { StoresService } from './stores.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('stores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('stores')
export class StoresController {
  constructor(private storesService: StoresService) {}

  @Get()
  async findAll(@Request() req) {
    return this.storesService.findAll(req.user.role, req.user.tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.storesService.findOne(id, req.user.role, req.user.tenantId);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  @Post()
  async create(@Body() data: any, @Request() req) {
    return this.storesService.create(data, req.user.tenantId);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: any, @Request() req) {
    return this.storesService.update(id, data, req.user.role, req.user.tenantId);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    return this.storesService.delete(id, req.user.role, req.user.tenantId);
  }
}
EOF

echo "✅ Stores Module created"

# Create Suppliers Module
echo "📦 Creating Suppliers Module..."
mkdir -p src/suppliers

cat > src/suppliers/suppliers.module.ts << 'EOF'
import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';

@Module({
  controllers: [SuppliersController],
  providers: [SuppliersService],
  exports: [SuppliersService],
})
export class SuppliersModule {}
EOF

cat > src/suppliers/suppliers.service.ts << 'EOF'
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async findAll(userRole: UserRole, tenantId?: string) {
    const where: any = {};
    if (userRole !== UserRole.SUPER_ADMIN) {
      where.tenantId = tenantId;
    }

    return this.prisma.supplier.findMany({
      where,
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, userRole: UserRole, tenantId?: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id },
      include: { products: true },
    });

    if (!supplier) throw new NotFoundException('Supplier not found');
    if (userRole !== UserRole.SUPER_ADMIN && supplier.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    return supplier;
  }

  async create(data: any, tenantId: string) {
    return this.prisma.supplier.create({
      data: { ...data, tenantId },
    });
  }

  async update(id: string, data: any, userRole: UserRole, tenantId?: string) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) throw new NotFoundException('Supplier not found');
    if (userRole !== UserRole.SUPER_ADMIN && supplier.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.supplier.update({ where: { id }, data });
  }

  async delete(id: string, userRole: UserRole, tenantId?: string) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id } });
    if (!supplier) throw new NotFoundException('Supplier not found');
    if (userRole !== UserRole.SUPER_ADMIN && supplier.tenantId !== tenantId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.supplier.delete({ where: { id } });
  }
}
EOF

cat > src/suppliers/suppliers.controller.ts << 'EOF'
import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SuppliersService } from './suppliers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('suppliers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('suppliers')
export class SuppliersController {
  constructor(private suppliersService: SuppliersService) {}

  @Get()
  async findAll(@Request() req) {
    return this.suppliersService.findAll(req.user.role, req.user.tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    return this.suppliersService.findOne(id, req.user.role, req.user.tenantId);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.STORE_MANAGER)
  @Post()
  async create(@Body() data: any, @Request() req) {
    return this.suppliersService.create(data, req.user.tenantId);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.STORE_MANAGER)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: any, @Request() req) {
    return this.suppliersService.update(id, data, req.user.role, req.user.tenantId);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string, @Request() req) {
    return this.suppliersService.delete(id, req.user.role, req.user.tenantId);
  }
}
EOF

echo "✅ Suppliers Module created"

echo "✅ All modules created successfully!"
echo ""
echo "Next steps:"
echo "1. Update app.module.ts to import all modules"
echo "2. Run: npm run prisma:generate"
echo "3. Run: npm run prisma:push"
echo "4. Restart the server: npm run start:dev"
