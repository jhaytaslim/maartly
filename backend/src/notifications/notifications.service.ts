import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import twilio from "twilio";

@Injectable()
export class NotificationsService {
  private emailTransporter: nodemailer.Transporter;
  private twilioClient!: twilio.Twilio;

  constructor(@Inject(ConfigService) private configService: ConfigService) {
    // Email transporter
    this.emailTransporter = nodemailer.createTransport({
      host: this.configService.get("SMTP_HOST"),
      port: this.configService.get("SMTP_PORT"),
      secure: this.configService.get("SMTP_SECURE") === "true",
      auth: {
        user: this.configService.get("SMTP_USER"),
        pass: this.configService.get("SMTP_PASS"),
      },
    });

    // Twilio client
    const accountSid = this.configService.get("TWILIO_ACCOUNT_SID");
    const authToken = this.configService.get("TWILIO_AUTH_TOKEN");

    if (accountSid && authToken) {
      this.twilioClient = twilio(accountSid, authToken);
    }
  }

  async sendEmail(options: {
    to: string;
    subject: string;
    template: string;
    context: any;
  }) {
    try {
      const html = this.getEmailTemplate(options.template, options.context);

      await this.emailTransporter.sendMail({
        from: this.configService.get("EMAIL_FROM"),
        to: options.to,
        subject: options.subject,
        html,
      });

      console.log(`📧 Email sent to ${options.to}`);
      return { success: true };
    } catch (error: unknown) {
      console.error("Email sending failed:", error);
      // return { success: false, error: error.message };
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async sendSMS(options: { to: string; message: string }) {
    if (!this.twilioClient) {
      console.warn("Twilio not configured");
      return { success: false, error: "SMS service not configured" };
    }

    try {
      await this.twilioClient.messages.create({
        body: options.message,
        from: this.configService.get("TWILIO_PHONE_NUMBER"),
        to: options.to,
      });

      console.log(`📱 SMS sent to ${options.to}`);
      return { success: true };
    } catch (error: unknown) {
      console.error("SMS sending failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  private getEmailTemplate(template: string, context: any): string {
    const templates: { [key: string]: string } = {
      "verify-email": `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #2C2E5E; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2C2E5E 0%, #5B83F6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .button { display: inline-block; padding: 12px 30px; background: #5B83F6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Maartly!</h1>
            </div>
            <div class="content">
              <p>Hi ${context.firstName},</p>
              <p>Thank you for registering with Maartly - Smart Sales. Simple Control.</p>
              <p>Please click the button below to verify your email and set your password:</p>
              <a href="${context.verificationLink}" class="button">Verify Email & Set Password</a>
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #5B83F6;">${context.verificationLink}</p>
              <p>This link will expire in 24 hours.</p>
            </div>
            <div class="footer">
              <p>© 2024 Maartly. All rights reserved.</p>
              <p>Smart Sales. Simple Control.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      "reset-password": `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #2C2E5E; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #2C2E5E 0%, #5B83F6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
            .button { display: inline-block; padding: 12px 30px; background: #5B83F6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset</h1>
            </div>
            <div class="content">
              <p>Hi ${context.firstName},</p>
              <p>We received a request to reset your password for your Maartly account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${context.resetLink}" class="button">Reset Password</a>
              <p>If you didn't request this, please ignore this email.</p>
              <p>This link will expire in 1 hour.</p>
            </div>
            <div class="footer">
              <p>© 2024 Maartly. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    return templates[template] || "";
  }
}
