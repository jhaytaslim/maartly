import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class StorefrontService {
  constructor(private prisma: PrismaService) {}

  // Get storefront configuration by tenant slug
  async getStorefrontBySlug(tenantSlug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      include: {
        storefrontConfig: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException("Storefront not found");
    }

    if (!tenant.storefrontConfig?.enabled) {
      throw new BadRequestException("Storefront is not enabled");
    }

    return {
      name: tenant.businessName,
      slug: tenant.slug,
      config: tenant.storefrontConfig,
    };
  }

  // Get products for storefront
  async getStorefrontProducts(tenantSlug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      include: {
        storefrontConfig: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException("Storefront not found");
    }

    if (!tenant.storefrontConfig?.enabled) {
      throw new BadRequestException("Storefront is not enabled");
    }

    const products = await this.prisma.product.findMany({
      where: {
        tenantId: tenant.id,
        isActive: true,
        stock: {
          gt: 0,
        },
      },
      include: {
        category: true,
        supplier: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return products;
  }

  // Get single product details for storefront
  async getStorefrontProduct(tenantSlug: string, productId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      include: {
        storefrontConfig: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException("Storefront not found");
    }

    if (!tenant.storefrontConfig?.enabled) {
      throw new BadRequestException("Storefront is not enabled");
    }

    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        tenantId: tenant.id,
        isActive: true,
      },
      include: {
        category: true,
        supplier: true,
      },
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }

  // Update storefront configuration
  async updateStorefrontConfig(tenantId: string, data: any) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        storefrontConfig: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException("Tenant not found");
    }

    if (tenant.storefrontConfig) {
      return this.prisma.storefrontConfig.update({
        where: { tenantId },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      });
    } else {
      return this.prisma.storefrontConfig.create({
        data: {
          tenantId,
          ...data,
        },
      });
    }
  }

  // Get storefront configuration for admin
  async getStorefrontConfig(tenantId: string) {
    const config = await this.prisma.storefrontConfig.findUnique({
      where: { tenantId },
      include: {
        tenant: {
          select: {
            businessName: true,
            slug: true,
          },
        },
      },
    });

    if (!config) {
      // Return default config if none exists
      return {
        enabled: false,
        tenantId,
        primaryColor: "#5B83F6",
        secondaryColor: "#2C2E5E",
        logo: null,
        bannerImage: null,
        customDomain: null,
      };
    }

    return config;
  }

  // Toggle storefront visibility
  async toggleStorefront(tenantId: string, enabled: boolean) {
    const config = await this.prisma.storefrontConfig.findUnique({
      where: { tenantId },
    });

    if (config) {
      return this.prisma.storefrontConfig.update({
        where: { tenantId },
        data: {
          enabled,
          updatedAt: new Date(),
        },
      });
    } else {
      return this.prisma.storefrontConfig.create({
        data: {
          tenantId,
          enabled,
        },
      });
    }
  }
}
