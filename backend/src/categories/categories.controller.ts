import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { CategoriesService } from "./categories.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@ApiTags("categories")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("categories")
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.categoriesService.findAll(req.user.role, req.user.tenantId);
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @Request() req: any) {
    return this.categoriesService.findOne(id, req.user.role, req.user.tenantId);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.STORE_MANAGER)
  @Post()
  async create(@Body() data: any, @Request() req: any) {
    return this.categoriesService.create(data, req.user.tenantId);
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.STORE_MANAGER)
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() data: any,
    @Request() req: any
  ) {
    return this.categoriesService.update(
      id,
      data,
      req.user.role,
      req.user.tenantId
    );
  }

  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  @Delete(":id")
  async delete(@Param("id") id: string, @Request() req: any) {
    return this.categoriesService.delete(id, req.user.role, req.user.tenantId);
  }
}
