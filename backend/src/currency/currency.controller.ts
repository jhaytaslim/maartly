import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('currency')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('supported')
  getSupportedCurrencies() {
    return this.currencyService.getSupportedCurrencies();
  }

  @Put('tenant/:tenantId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  async setTenantCurrency(
    @Param('tenantId') tenantId: string,
    @Body() dto: { currency: string; locked: boolean },
  ) {
    await this.currencyService.setTenantCurrency(tenantId, dto.currency, dto.locked);
    return { message: 'Tenant currency updated successfully' };
  }

  @Put('store/:storeId')
  @Roles(UserRole.TENANT_ADMIN, UserRole.STORE_MANAGER)
  async setStoreCurrency(
    @Param('storeId') storeId: string,
    @Body() dto: { currency: string; tenantId: string },
  ) {
    await this.currencyService.setStoreCurrency(storeId, dto.currency, dto.tenantId);
    return { message: 'Store currency updated successfully' };
  }

  @Get('store/:storeId/effective')
  async getEffectiveCurrency(@Param('storeId') storeId: string) {
    const currency = await this.currencyService.getEffectiveCurrency(storeId);
    return { currency };
  }
}
