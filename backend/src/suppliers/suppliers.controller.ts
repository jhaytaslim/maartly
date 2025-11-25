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
import { SuppliersService } from "./suppliers.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "@prisma/client";
import { CreateSupplierDto } from "./dtos/create-supplier.dto";

@ApiTags("suppliers")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("suppliers")
export class SuppliersController {
  constructor(private suppliersService: SuppliersService) {}

  @Get()
  async findAll(@Request() req: any) {
    return this.suppliersService.findAll(req.user.role, req.user.tenantId);
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @Request() req: any) {
    return this.suppliersService.findOne(id, req.user.role, req.user.tenantId);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.STORE_MANAGER)
  async create(@Body() data: CreateSupplierDto, @Request() req: any) {
    return this.suppliersService.create(data, req.user.tenantId);
  }

  @Patch(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.STORE_MANAGER)
  async update(
    @Param("id") id: string,
    @Body() data: any,
    @Request() req: any
  ) {
    return this.suppliersService.update(
      id,
      data,
      req.user.role,
      req.user.tenantId
    );
  }

  @Delete(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  async delete(@Param("id") id: string, @Request() req: any) {
    return this.suppliersService.delete(id, req.user.role, req.user.tenantId);
  }
}
