import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { DebtsService } from './debts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('debts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DebtsController {
  constructor(private readonly debtsService: DebtsService) {}

  @Post()
  @Roles(UserRole.TENANT_ADMIN, UserRole.STORE_MANAGER, UserRole.CASHIER)
  create(@Body() createDebtDto: any) {
    return this.debtsService.create(createDebtDto);
  }

  @Get()
  findAll(
    @Query('tenantId') tenantId: string,
    @Query('customerId') customerId?: string,
    @Query('isSettled') isSettled?: string,
    @Query('overdue') overdue?: string,
  ) {
    return this.debtsService.findAll(tenantId, {
      customerId,
      isSettled: isSettled === 'true',
      overdue: overdue === 'true',
    });
  }

  @Get('statistics')
  getStatistics(@Query('tenantId') tenantId: string) {
    return this.debtsService.getStatistics(tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debtsService.findOne(id);
  }

  @Post(':id/payments')
  @Roles(UserRole.TENANT_ADMIN, UserRole.STORE_MANAGER, UserRole.CASHIER)
  recordPayment(@Param('id') id: string, @Body() paymentDto: any) {
    return this.debtsService.recordPayment(id, paymentDto);
  }

  @Delete(':id')
  @Roles(UserRole.TENANT_ADMIN, UserRole.STORE_MANAGER)
  delete(@Param('id') id: string) {
    return this.debtsService.delete(id);
  }
}
