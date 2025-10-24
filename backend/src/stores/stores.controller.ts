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
import { StoresService } from "./stores.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@ApiTags("stores")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("stores")
export class StoresController {
  constructor(private storesService: StoresService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  async findAll(@Request() req: any) {
    return this.storesService.findAll(req.user.role, req.user.tenantId);
  }

  @Get(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.STORE_MANAGER)
  async findOne(@Param("id") id: string, @Request() req: any) {
    return this.storesService.findOne(id, req.user.role, req.user.tenantId);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  async create(@Body() data: any, @Request() req: any) {
    return this.storesService.create(data, req.user.tenantId);
  }

  @Patch(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  async update(
    @Param("id") id: string,
    @Body() data: any,
    @Request() req: any
  ) {
    return this.storesService.update(
      id,
      data,
      req.user.role,
      req.user.tenantId
    );
  }

  @Delete(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  async delete(@Param("id") id: string, @Request() req: any) {
    return this.storesService.delete(id, req.user.role, req.user.tenantId);
  }
}
