import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { TenantsService } from "./tenants.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "@prisma/client";
import { Public } from "../auth/decorators/public.decorator";

@ApiTags("tenants")
@Controller("tenants")
export class TenantsController {
  constructor(private tenantsService: TenantsService) {}

  @ApiOperation({ summary: "Get all tenants (Super Admin only)" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Get()
  async findAll(@Request() req: any) {
    return this.tenantsService.findAll(req.user.role);
  }

  @ApiOperation({ summary: "Get tenant by ID" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(@Param("id") id: string, @Request() req: any) {
    return this.tenantsService.findOne(id, req.user.role, req.user.tenantId);
  }

  @ApiOperation({ summary: "Get tenant by slug (public - for storefront)" })
  @Public()
  @Get("slug/:slug")
  async findBySlug(@Param("slug") slug: string) {
    return this.tenantsService.findBySlug(slug);
  }

  @ApiOperation({
    summary: "Get storefront info by slug (alias for slug/:slug)",
  })
  @Public()
  @Get("storefront/:slug")
  async getStorefront(@Param("slug") slug: string) {
    return this.tenantsService.findBySlug(slug);
  }

  @ApiOperation({ summary: "Get public products for storefront" })
  @Public()
  @Get("storefront/:slug/products")
  async getStorefrontProducts(@Param("slug") slug: string) {
    return this.tenantsService.getStorefrontProducts(slug);
  }

  @ApiOperation({ summary: "Get tenant stats" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(":id/stats")
  async getStats(@Param("id") id: string, @Request() req: any) {
    // For now, allow tenant admins to see their own stats
    if (req.user.role !== UserRole.SUPER_ADMIN && id !== req.user.tenantId) {
      return this.tenantsService.getStats(req.user.tenantId);
    }
    return this.tenantsService.getStats(id);
  }

  @ApiOperation({ summary: "Update tenant details" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() data: any,
    @Request() req: any
  ) {
    return this.tenantsService.update(
      id,
      data,
      req.user.role,
      req.user.tenantId
    );
  }

  @ApiOperation({ summary: "Update subscription (Super Admin only)" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @Patch(":id/subscription")
  async updateSubscription(
    @Param("id") id: string,
    @Body() data: any,
    @Request() req: any
  ) {
    return this.tenantsService.updateSubscription(id, data, req.user.role);
  }
}
