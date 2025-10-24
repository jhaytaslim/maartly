import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
} from "@nestjs/common";
import { StorefrontService } from "./storefront.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Public } from "../auth/decorators/public.decorator";
import { $Enums } from "@prisma/client";

@Controller("storefront")
@UseGuards(JwtAuthGuard, RolesGuard)
export class StorefrontController {
  constructor(private readonly storefrontService: StorefrontService) {}

  // Public endpoint to get storefront configuration
  @Public()
  @Get("tenant/:tenantSlug")
  async getStorefrontBySlug(@Param("tenantSlug") tenantSlug: string) {
    return this.storefrontService.getStorefrontBySlug(tenantSlug);
  }

  // Public endpoint to get storefront products
  @Public()
  @Get("tenant/:tenantSlug/products")
  async getStorefrontProducts(@Param("tenantSlug") tenantSlug: string) {
    return this.storefrontService.getStorefrontProducts(tenantSlug);
  }

  // Public endpoint to get product details
  @Public()
  @Get("tenant/:tenantSlug/products/:productId")
  async getStorefrontProduct(
    @Param("tenantSlug") tenantSlug: string,
    @Param("productId") productId: string
  ) {
    return this.storefrontService.getStorefrontProduct(tenantSlug, productId);
  }

  // Admin endpoint to update storefront configuration
  @Put("config")
  @Roles($Enums.UserRole.SUPER_ADMIN, $Enums.UserRole.TENANT_ADMIN)
  async updateStorefrontConfig(@Req() req: any, @Body() data: any) {
    const tenantId = req.user.tenantId;
    return this.storefrontService.updateStorefrontConfig(tenantId, data);
  }

  // Admin endpoint to get storefront configuration
  @Get("config")
  @Roles($Enums.UserRole.SUPER_ADMIN, $Enums.UserRole.TENANT_ADMIN)
  async getStorefrontConfig(@Req() req: any) {
    const tenantId = req.user.tenantId;
    return this.storefrontService.getStorefrontConfig(tenantId);
  }

  // Admin endpoint to toggle storefront visibility
  @Put("toggle")
  @Roles($Enums.UserRole.SUPER_ADMIN, $Enums.UserRole.TENANT_ADMIN)
  async toggleStorefront(@Req() req: any, @Body() data: { enabled: boolean }) {
    const tenantId = req.user.tenantId;
    return this.storefrontService.toggleStorefront(tenantId, data.enabled);
  }
}
