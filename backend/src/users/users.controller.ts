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
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "@prisma/client";

@ApiTags("users")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("users")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: "Get all users (role-based filtering)" })
  @Get()
  async findAll(@Request() req: any) {
    return this.usersService.findAll(
      req.user.role,
      req.user.tenantId,
      req.user.storeId
    );
  }

  @ApiOperation({ summary: "Get user by ID" })
  @Get(":id")
  async findOne(@Param("id") id: string, @Request() req: any) {
    return this.usersService.findOne(id, req.user.role, req.user.tenantId);
  }

  @ApiOperation({ summary: "Create new user" })
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN, UserRole.STORE_MANAGER)
  @Post()
  async create(@Body() data: any, @Request() req: any) {
    // Inherit tenant/store from creator if not specified
    if (!data.tenantId && req.user.tenantId) {
      data.tenantId = req.user.tenantId;
    }
    if (
      !data.storeId &&
      req.user.storeId &&
      req.user.role === UserRole.STORE_MANAGER
    ) {
      data.storeId = req.user.storeId;
    }
    return this.usersService.create(data);
  }

  @ApiOperation({ summary: "Update user" })
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() data: any,
    @Request() req: any
  ) {
    return this.usersService.update(id, data, req.user.role, req.user.tenantId);
  }

  @ApiOperation({ summary: "Change user role" })
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  @Patch(":id/role")
  async changeRole(
    @Param("id") id: string,
    @Body() data: { role: UserRole },
    @Request() req: any
  ) {
    return this.usersService.changeRole(
      id,
      data.role,
      req.user.role,
      req.user.tenantId
    );
  }

  @ApiOperation({ summary: "Delete/deactivate user" })
  @Roles(UserRole.SUPER_ADMIN, UserRole.TENANT_ADMIN)
  @Delete(":id")
  async delete(@Param("id") id: string, @Request() req: any) {
    return this.usersService.delete(id, req.user.role, req.user.tenantId);
  }
}
