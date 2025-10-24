import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole, OrderStatus } from '@prisma/client';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(UserRole.TENANT_ADMIN, UserRole.STORE_MANAGER, UserRole.CASHIER)
  create(@Body() createOrderDto: any) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll(
    @Query('tenantId') tenantId: string,
    @Query('storeId') storeId?: string,
    @Query('customerId') customerId?: string,
    @Query('status') status?: OrderStatus,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.ordersService.findAll(tenantId, {
      storeId,
      customerId,
      status,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get('statistics')
  getStatistics(
    @Query('tenantId') tenantId: string,
    @Query('storeId') storeId?: string,
  ) {
    return this.ordersService.getStatistics(tenantId, storeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Put(':id/cancel')
  @Roles(UserRole.TENANT_ADMIN, UserRole.STORE_MANAGER)
  cancel(@Param('id') id: string) {
    return this.ordersService.cancel(id);
  }
}
