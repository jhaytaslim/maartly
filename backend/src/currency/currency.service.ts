import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi' },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', symbol: 'ر.س', name: 'Saudi Riyal' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
];

@Injectable()
export class CurrencyService {
  constructor(private readonly prisma: PrismaService) {}

  getSupportedCurrencies() {
    return SUPPORTED_CURRENCIES;
  }

  async setTenantCurrency(tenantId: string, currency: string, locked: boolean): Promise<void> {
    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        currency,
        currencyLocked: locked,
      },
    });
  }

  async setStoreCurrency(storeId: string, currency: string, tenantId: string): Promise<void> {
    // Check if tenant allows store-level currency changes
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { currencyLocked: true },
    });

    if (tenant?.currencyLocked) {
      throw new ForbiddenException('Currency is locked at tenant level and cannot be changed for individual stores');
    }

    await this.prisma.store.update({
      where: { id: storeId },
      data: { currency },
    });
  }

  async getEffectiveCurrency(storeId: string): Promise<string> {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      include: { tenant: { select: { currency: true, currencyLocked: true } } },
    });

    if (!store) {
      return 'USD'; // Default fallback
    }

    // If currency is locked at tenant level or store has no custom currency, use tenant currency
    if (store.tenant.currencyLocked || !store.currency) {
      return store.tenant.currency;
    }

    return store.currency;
  }
}
