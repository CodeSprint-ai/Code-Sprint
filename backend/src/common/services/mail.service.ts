import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { emailVerificationTemplate } from './templates/email-verification.template';
import { passwordResetTemplate } from './templates/password-reset.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: parseInt(this.configService.get('SMTP_PORT')!, 10),
      secure: this.configService.get('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendEmailVerification(
    email: string,
    name: string,
    token: string,
    theme: 'dark' | 'light' = 'dark',
  ): Promise<void> {
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    const url = `${frontendUrl}/auth/verify-email?token=${token}`;
    try {
      await this.transporter.sendMail({
        from: `"CodeSprint AI" <${this.configService.get('SMTP_USER')}>`,
        to: email,
        subject: 'Verify your email – CodeSprint AI',
        html: emailVerificationTemplate(name, url, theme),
      });
      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}`, error);
      throw error;
    }
  }

  async sendPasswordReset(
    email: string,
    name: string,
    token: string,
    theme: 'dark' | 'light' = 'dark',
  ): Promise<void> {
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    const url = `${frontendUrl}/auth/reset-password?token=${token}`;
    try {
      await this.transporter.sendMail({
        from: `"CodeSprint AI" <${this.configService.get('SMTP_USER')}>`,
        to: email,
        subject: 'Reset your password – CodeSprint AI',
        html: passwordResetTemplate(name, url, theme),
      });
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}`, error);
      throw error;
    }
  }
}
