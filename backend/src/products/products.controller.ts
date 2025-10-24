import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { ProductsService } from "./products.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@ApiTags("products")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("products")
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.productsService.findAll(
      req.user.role,
      req.user.tenantId,
      req.user.storeId
    );
  }

  @Get("search")
  async search(@Query("q") query: string, @Request() req: any) {
    return this.productsService.search(query, req.user.tenantId);
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @Request() req: any) {
    return this.productsService.findOne(id, req.user.role, req.user.tenantId);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.STORE_MANAGER)
  @Post()
  async create(@Body() data: any, @Request() req: any) {
    return this.productsService.create(data, req.user.tenantId);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.STORE_MANAGER)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() data: any,
    @Request() req: any
  ) {
    return this.productsService.update(
      id,
      data,
      req.user.role,
      req.user.tenantId
    );
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  @Delete(":id")
  async delete(@Param("id") id: string, @Request() req: any) {
    return this.productsService.delete(id, req.user.role, req.user.tenantId);
  }
}
