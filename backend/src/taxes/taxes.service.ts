import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaxType, TaxRegion } from '@prisma/client';

export interface CreateTaxDto {
  name: string;
  code: string;
  rate: number;
  taxType: TaxType;
  description?: string;
  region: TaxRegion;
  country?: string;
  isCompound: boolean;
  includeInPrice: boolean;
  tenantId: string;
}

export interface UpdateTaxDto {
  name?: string;
  code?: string;
  rate?: number;
  taxType?: TaxType;
  description?: string;
  region?: TaxRegion;
  country?: string;
  isCompound?: boolean;
  includeInPrice?: boolean;
  isActive?: boolean;
}

// Predefined tax templates by region
export const TAX_TEMPLATES = {
  [TaxRegion.NIGERIA]: [
    { name: 'VAT', code: 'VAT', rate: 7.5, description: 'Value Added Tax (Nigeria)' },
  ],
  [TaxRegion.AFRICA]: [
    { name: 'VAT (Kenya)', code: 'VAT_KE', rate: 16, description: 'Value Added Tax (Kenya)' },
    { name: 'VAT (South Africa)', code: 'VAT_ZA', rate: 15, description: 'Value Added Tax (South Africa)' },
    { name: 'VAT (Ghana)', code: 'VAT_GH', rate: 12.5, description: 'Value Added Tax (Ghana)' },
    { name: 'VAT (Egypt)', code: 'VAT_EG', rate: 14, description: 'Value Added Tax (Egypt)' },
  ],
  [TaxRegion.EUROPE]: [
    { name: 'VAT (Standard)', code: 'VAT_EU', rate: 20, description: 'Standard VAT Rate (Europe)' },
    { name: 'VAT (Reduced)', code: 'VAT_EU_RED', rate: 10, description: 'Reduced VAT Rate (Europe)' },
  ],
  [TaxRegion.ARABIA]: [
    { name: 'VAT (UAE)', code: 'VAT_UAE', rate: 5, description: 'Value Added Tax (UAE)' },
    { name: 'VAT (Saudi Arabia)', code: 'VAT_SA', rate: 15, description: 'Value Added Tax (Saudi Arabia)' },
  ],
  [TaxRegion.GLOBAL]: [
    { name: 'Sales Tax', code: 'SALES_TAX', rate: 8, description: 'General Sales Tax' },
    { name: 'GST', code: 'GST', rate: 10, description: 'Goods and Services Tax' },
  ],
};

@Injectable()
export class TaxesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTaxDto) {
    return this.prisma.tax.create({
      data: {
        name: dto.name,
        code: dto.code,
        rate: dto.rate,
        taxType: dto.taxType,
        description: dto.description,
        region: dto.region,
        country: dto.country,
        isCompound: dto.isCompound,
        includeInPrice: dto.includeInPrice,
        tenantId: dto.tenantId,
      },
    });
  }

  async findAll(tenantId: string, filters?: {
    region?: TaxRegion;
    country?: string;
    isActive?: boolean;
  }) {
    const where: any = { tenantId };

    if (filters?.region) {
      where.region = filters.region;
    }

    if (filters?.country) {
      where.country = filters.country;
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return this.prisma.tax.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const tax = await this.prisma.tax.findUnique({
      where: { id },
    });

    if (!tax) {
      throw new NotFoundException('Tax not found');
    }

    return tax;
  }

  async update(id: string, dto: UpdateTaxDto) {
    await this.findOne(id); // Check if exists

    return this.prisma.tax.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.findOne(id); // Check if exists

    return this.prisma.tax.delete({
      where: { id },
    });
  }

  async calculateTax(amount: number, taxIds: string[]): Promise<{
    subtotal: number;
    taxAmount: number;
    total: number;
    breakdown: Array<{ name: string; rate: number; amount: number }>;
  }> {
    const taxes = await this.prisma.tax.findMany({
      where: {
        id: { in: taxIds },
        isActive: true,
      },
    });

    let taxableAmount = amount;
    let totalTaxAmount = 0;
    const breakdown: Array<{ name: string; rate: number; amount: number }> = [];

    // Sort taxes: non-compound first, then compound
    const sortedTaxes = [
      ...taxes.filter(t => !t.isCompound),
      ...taxes.filter(t => t.isCompound),
    ];

    for (const tax of sortedTaxes) {
      let taxAmount: number;

      if (tax.taxType === TaxType.PERCENTAGE) {
        taxAmount = (taxableAmount * tax.rate) / 100;
      } else {
        taxAmount = tax.rate; // Fixed amount
      }

      totalTaxAmount += taxAmount;
      breakdown.push({
        name: tax.name,
        rate: tax.rate,
        amount: taxAmount,
      });

      // If compound, next tax is calculated on amount including this tax
      if (tax.isCompound) {
        taxableAmount += taxAmount;
      }
    }

    return {
      subtotal: amount,
      taxAmount: totalTaxAmount,
      total: amount + totalTaxAmount,
      breakdown,
    };
  }

  getTaxTemplates(region?: TaxRegion) {
    if (region) {
      return TAX_TEMPLATES[region] || [];
    }
    return TAX_TEMPLATES;
  }
}
