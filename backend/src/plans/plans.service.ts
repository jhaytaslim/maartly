import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionPlan } from '@prisma/client';

export interface CreatePlanDto {
  name: string;
  type: SubscriptionPlan;
  monthlyPrice: number;
  annualPrice: number;
  maxStores: number;
  maxProducts: number;
  maxUsers: number;
  features: string[];
}

export interface UpdatePlanDto {
  name?: string;
  monthlyPrice?: number;
  annualPrice?: number;
  maxStores?: number;
  maxProducts?: number;
  maxUsers?: number;
  features?: string[];
  isActive?: boolean;
}

@Injectable()
export class PlansService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePlanDto) {
    return this.prisma.pricingPlan.create({
      data: dto,
    });
  }

  async findAll(includeInactive = false) {
    const where = includeInactive ? {} : { isActive: true };
    
    return this.prisma.pricingPlan.findMany({
      where,
      orderBy: {
        monthlyPrice: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const plan = await this.prisma.pricingPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    return plan;
  }

  async findByType(type: SubscriptionPlan) {
    return this.prisma.pricingPlan.findFirst({
      where: {
        type,
        isActive: true,
      },
    });
  }

  async update(id: string, dto: UpdatePlanDto) {
    await this.findOne(id);

    return this.prisma.pricingPlan.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    await this.findOne(id);

    return this.prisma.pricingPlan.delete({
      where: { id },
    });
  }

  async getDefaultPlans() {
    // Return default plan configurations
    return [
      {
        name: 'Starter',
        type: SubscriptionPlan.STARTER,
        monthlyPrice: 29,
        annualPrice: 290,
        maxStores: 1,
        maxProducts: 500,
        maxUsers: 2,
        features: [
          'Single Store',
          'Up to 500 Products',
          '2 User Accounts',
          'Basic POS',
          'Inventory Management',
          'Sales Reports',
          'Email Support',
        ],
      },
      {
        name: 'Professional',
        type: SubscriptionPlan.PROFESSIONAL,
        monthlyPrice: 79,
        annualPrice: 790,
        maxStores: 5,
        maxProducts: 5000,
        maxUsers: 10,
        features: [
          'Up to 5 Stores',
          'Up to 5,000 Products',
          '10 User Accounts',
          'Advanced POS',
          'Multi-Store Inventory',
          'Product Transfers',
          'Advanced Reports',
          'Tax Management',
          'Debt Tracking',
          'Priority Support',
          'API Access',
        ],
      },
      {
        name: 'Enterprise',
        type: SubscriptionPlan.ENTERPRISE,
        monthlyPrice: 199,
        annualPrice: 1990,
        maxStores: -1, // Unlimited
        maxProducts: -1, // Unlimited
        maxUsers: -1, // Unlimited
        features: [
          'Unlimited Stores',
          'Unlimited Products',
          'Unlimited Users',
          'Enterprise POS',
          'Advanced Analytics',
          'Custom Integrations',
          'Dedicated Account Manager',
          '24/7 Premium Support',
          'Custom Development',
          'White Label Options',
          'SLA Guarantee',
        ],
      },
    ];
  }

  async initializeDefaultPlans() {
    const defaultPlans = await this.getDefaultPlans();
    
    for (const plan of defaultPlans) {
      const existing = await this.prisma.pricingPlan.findFirst({
        where: { type: plan.type },
      });

      if (!existing) {
        await this.prisma.pricingPlan.create({
          data: plan,
        });
      }
    }

    return { message: 'Default plans initialized' };
  }
}
