import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as argon2 from "@node-rs/argon2";
import { randomBytes } from "crypto";
import { PrismaService } from "../prisma/prisma.service";
import { NotificationsService } from "../notifications/notifications.service";
import { UserRole } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private notificationsService: NotificationsService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        tenant: true,
        store: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (!user.isActive) {
      throw new UnauthorizedException("Account is deactivated");
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException("Please verify your email first");
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      storeId: user.storeId,
    };

    // Get accessible routes and permissions based on role
    const accessibleRoutes = this.getAccessibleRoutes(user.role);
    const permissions = this.getPermissions(user.role);

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenant: user.tenant,
        store: user.store,
        language: user.language,
        theme: user.theme,
      },
      accessibleRoutes,
      permissions,
    };
  }

  private getAccessibleRoutes(role: string): string[] {
    const routes: Record<string, string[]> = {
      SUPER_ADMIN: ["dashboard", "pricing-plans", "settings"],
      TENANT_ADMIN: [
        "dashboard",
        "pos",
        "products",
        "categories",
        "suppliers",
        "product-transfer",
        "low-stock-alerts",
        "orders",
        "tax-management",
        "pricing-plans",
        "employees",
        "customers",
        "stores",
        "debt-management",
        "settings",
      ],
      STORE_MANAGER: [
        "dashboard",
        "products",
        "categories",
        "suppliers",
        "product-transfer",
        "low-stock-alerts",
        "orders",
        "tax-management",
        "employees",
        "customers",
        "debt-management",
        "settings",
      ],
      CASHIER: [
        "dashboard",
        "pos",
        "low-stock-alerts",
        "debt-management",
        "settings",
      ],
    };

    return routes[role] || [];
  }

  private getPermissions(role: string): string[] {
    const permissions: Record<string, string[]> = {
      SUPER_ADMIN: [
        "view_platform_dashboard",
        "manage_pricing_plans",
        "manage_tenants",
      ],
      TENANT_ADMIN: [
        "view_tenant_dashboard",
        "manage_products",
        "manage_categories",
        "manage_suppliers",
        "approve_transfers",
        "manage_all_orders",
        "manage_taxes",
        "manage_all_employees",
        "manage_customers",
        "manage_stores",
        "manage_all_debts",
        "manage_company_settings",
      ],
      STORE_MANAGER: [
        "view_store_dashboard",
        "manage_products",
        "manage_categories",
        "manage_suppliers",
        "request_transfers",
        "manage_store_orders",
        "manage_store_employees",
        "manage_customers",
        "manage_store_debts",
      ],
      CASHIER: [
        "view_personal_dashboard",
        "use_pos",
        "view_products",
        "manage_personal_debts",
      ],
    };

    return permissions[role] || [];
  }

  async signupTenant(dto: {
    businessName: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    plan: string;
    slug?: string;
  }) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException("Email already registered");
    }

    // Generate or validate slug
    let slug = dto.slug;
    if (!slug) {
      // Auto-generate slug from business name
      slug = dto.businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      // Ensure uniqueness by appending number if needed
      let counter = 1;
      let uniqueSlug = slug;
      while (
        await this.prisma.tenant.findUnique({ where: { slug: uniqueSlug } })
      ) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }
      slug = uniqueSlug;
    } else {
      // Validate provided slug
      const existingTenant = await this.prisma.tenant.findUnique({
        where: { slug },
      });
      if (existingTenant) {
        throw new ConflictException(
          "Slug already taken. Please choose another."
        );
      }
    }

    // Create tenant
    const planLimits = this.getPlanLimits(dto.plan);

    const tenant = await this.prisma.tenant.create({
      data: {
        businessName: dto.businessName,
        slug,
        email: dto.email,
        phone: dto.phone,
        subscriptionPlan: dto.plan.toUpperCase() as any,
        subscriptionStatus: "TRIAL",
        ...planLimits,
      },
    });

    // Generate email verification token
    const verificationToken = randomBytes(32).toString("hex");

    // Create tenant admin user (without password initially)
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: "", // Will be set when they verify email
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        role: UserRole.TENANT_ADMIN,
        tenantId: tenant.id,
        emailVerificationToken: verificationToken,
      },
    });

    // Send verification email
    await this.notificationsService.sendEmail({
      to: dto.email,
      subject: "Verify your Martly account",
      template: "verify-email",
      context: {
        firstName: dto.firstName,
        verificationLink: `${this.configService.get("APP_URL")}/verify-email?token=${verificationToken}`,
      },
    });

    return {
      message:
        "Registration successful. Please check your email to verify your account and set your password.",
      userId: user.id,
    };
  }

  async verifyTokenValidity(token: string) {
    const user = await this.prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new BadRequestException("Invalid or expired verification token");
    }

    return {
      valid: true,
      message: "Token is valid",
    };
  }

  async verifyEmailAndSetPassword(token: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new BadRequestException("Invalid or expired verification token");
    }

    const hashedPassword = await argon2.hash(password);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        emailVerified: true,
        emailVerificationToken: null,
      },
    });

    return { message: "Email verified and password set successfully" };
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists
      return { message: "If the email exists, a reset link has been sent" };
    }

    const resetToken = randomBytes(32).toString("hex");
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires,
      },
    });

    await this.notificationsService.sendEmail({
      to: email,
      subject: "Reset your Martly password",
      template: "reset-password",
      context: {
        firstName: user.firstName,
        resetLink: `${this.configService.get("APP_URL")}/reset-password?token=${resetToken}`,
      },
    });

    return { message: "If the email exists, a reset link has been sent" };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException("Invalid or expired reset token");
    }

    const hashedPassword = await argon2.hash(newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return { message: "Password reset successfully" };
  }

  private getPlanLimits(plan: string): {
    maxStores: number;
    maxProducts: number;
    maxUsers: number;
  } {
    const limits: Record<
      string,
      {
        maxStores: number;
        maxProducts: number;
        maxUsers: number;
      }
    > = {
      STARTER: {
        maxStores: 1,
        maxProducts: 500,
        maxUsers: 1,
      },
      PROFESSIONAL: {
        maxStores: 3,
        maxProducts: 2000,
        maxUsers: 5,
      },
      ENTERPRISE: {
        maxStores: 999,
        maxProducts: 999999,
        maxUsers: 999,
      },
    };

    return limits[plan.toUpperCase()] || limits.STARTER;
  }

  // Check access permissions based on role
  canAccess(userRole: UserRole, resource: string): boolean {
    const permissions = {
      [UserRole.SUPER_ADMIN]: [
        "pricing-plans",
        "payment-methods",
        "tenant-management",
        "all",
      ],
      [UserRole.TENANT_ADMIN]: [
        "dashboard",
        "products",
        "categories",
        "suppliers",
        "product-transfer",
        "low-stock-alerts",
        "orders",
        "tax-management",
        "employees",
        "customers",
        "debt-management",
        "settings",
        "payment-methods-view",
        "subscription-change",
      ],
      [UserRole.STORE_MANAGER]: [
        "dashboard-store",
        "products",
        "categories",
        "suppliers",
        "low-stock-alerts",
        "orders",
        "tax-management",
        "employees-store",
        "customers",
        "debt-management",
        "settings-limited",
        "product-transfer-request",
      ],
      [UserRole.CASHIER]: [
        "pos",
        "dashboard-personal",
        "debt-management-personal",
        "stock-alerts-store",
        "settings-basic",
      ],
    };

    return (
      permissions[userRole]?.includes(resource) ||
      permissions[userRole]?.includes("all")
    );
  }
}
