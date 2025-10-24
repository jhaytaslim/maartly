import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserRole } from "@prisma/client";
import * as argon2 from "@node-rs/argon2";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(userRole: UserRole, tenantId?: string, storeId?: string) {
    // Role-based filtering
    const where: any = {};

    if (userRole === UserRole.SUPER_ADMIN) {
      // Super admin can see all users
    } else if (userRole === UserRole.TENANT_ADMIN) {
      where.tenantId = tenantId;
    } else if (userRole === UserRole.STORE_MANAGER) {
      where.storeId = storeId;
    } else {
      throw new ForbiddenException("Insufficient permissions");
    }

    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        emailVerified: true,
        lastLogin: true,
        createdAt: true,
        tenant: {
          select: {
            id: true,
            businessName: true,
          },
        },
        store: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userRole: UserRole, tenantId?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        tenant: true,
        store: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Role-based access control
    if (userRole !== UserRole.SUPER_ADMIN && user.tenantId !== tenantId) {
      throw new ForbiddenException("Access denied");
    }

    const { password, ...result } = user;
    return result;
  }

  async create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: UserRole;
    tenantId?: string;
    storeId?: string;
  }) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException("User with this email already exists");
    }

    // Hash password
    const hashedPassword = await argon2.hash(data.password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        emailVerified: true, // Auto-verify for admin-created users
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });

    // Update tenant user count
    if (data.tenantId) {
      await this.prisma.tenant.update({
        where: { id: data.tenantId },
        data: {
          currentUserCount: {
            increment: 1,
          },
        },
      });
    }

    return user;
  }

  async update(
    id: string,
    data: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      isActive?: boolean;
      language?: string;
      theme?: string;
    },
    userRole: UserRole,
    tenantId?: string
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Check permissions
    if (userRole !== UserRole.SUPER_ADMIN && user.tenantId !== tenantId) {
      throw new ForbiddenException("Access denied");
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isActive: true,
        language: true,
        theme: true,
      },
    });
  }

  async changeRole(
    id: string,
    newRole: UserRole,
    adminRole: UserRole,
    tenantId?: string
  ) {
    if (
      adminRole !== UserRole.SUPER_ADMIN &&
      adminRole !== UserRole.TENANT_ADMIN
    ) {
      throw new ForbiddenException("Only admins can change roles");
    }

    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (adminRole === UserRole.TENANT_ADMIN && user.tenantId !== tenantId) {
      throw new ForbiddenException("Access denied");
    }

    return this.prisma.user.update({
      where: { id },
      data: { role: newRole },
    });
  }

  async delete(id: string, userRole: UserRole, tenantId?: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (userRole !== UserRole.SUPER_ADMIN && user.tenantId !== tenantId) {
      throw new ForbiddenException("Access denied");
    }

    // Soft delete - just deactivate
    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    // Update tenant user count
    if (user.tenantId) {
      await this.prisma.tenant.update({
        where: { id: user.tenantId },
        data: {
          currentUserCount: {
            decrement: 1,
          },
        },
      });
    }

    return { message: "User deactivated successfully" };
  }
}
