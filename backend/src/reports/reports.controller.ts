import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  getDashboardSummary(
    @Query('tenantId') tenantId: string,
    @Query('storeId') storeId?: string,
  ) {
    return this.reportsService.getDashboardSummary(tenantId, storeId);
  }

  @Get('daily-sales')
  getDailySalesReport(
    @Query('tenantId') tenantId: string,
    @Query('date') date: string,
    @Query('storeId') storeId?: string,
  ) {
    return this.reportsService.getDailySalesReport(
      tenantId,
      new Date(date),
      storeId,
    );
  }

  @Get('weekly-sales')
  getWeeklySalesReport(
    @Query('tenantId') tenantId: string,
    @Query('weekStart') weekStart: string,
    @Query('storeId') storeId?: string,
  ) {
    return this.reportsService.getWeeklySalesReport(
      tenantId,
      new Date(weekStart),
      storeId,
    );
  }

  @Get('inventory')
  getInventoryReport(
    @Query('tenantId') tenantId: string,
    @Query('storeId') storeId?: string,
  ) {
    return this.reportsService.getInventoryReport(tenantId, storeId);
  }
}
