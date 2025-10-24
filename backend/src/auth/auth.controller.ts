import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "Login with email and password" })
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: "Register new tenant" })
  @Post("signup")
  async signup(
    @Body()
    dto: {
      businessName: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      plan: string;
      slug?: string;
    }
  ) {
    return this.authService.signupTenant(dto);
  }

  @ApiOperation({ summary: "Verify email and set password" })
  @Post("verify-email")
  async verifyEmail(@Body() dto: { token: string; password: string }) {
    return this.authService.verifyEmailAndSetPassword(dto.token, dto.password);
  }

  @ApiOperation({ summary: "Verify token validity" })
  @Post("verify-token")
  async verifyToken(@Body() dto: { token: string }) {
    return this.authService.verifyTokenValidity(dto.token);
  }

  @ApiOperation({ summary: "Request password reset" })
  @Post("forgot-password")
  async forgotPassword(@Body() dto: { email: string }) {
    return this.authService.requestPasswordReset(dto.email);
  }

  @ApiOperation({ summary: "Reset password with token" })
  @Post("reset-password")
  async resetPassword(@Body() dto: { token: string; password: string }) {
    return this.authService.resetPassword(dto.token, dto.password);
  }
}
