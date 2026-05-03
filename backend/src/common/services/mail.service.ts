import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { emailVerificationTemplate } from './templates/email-verification.template';
import { passwordResetTemplate } from './templates/password-reset.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private resend: Resend;

  constructor(private readonly configService: ConfigService) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
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
      const { error } = await this.resend.emails.send({
        from: 'CodeSprint AI <onboarding@resend.dev>',
        to: email,
        subject: 'Verify your email – CodeSprint AI',
        html: emailVerificationTemplate(name, url, theme),
      });
      if (error) {
        this.logger.error(`Resend error for ${email}`, error);
        throw new Error(error.message);
      }
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
      const { error } = await this.resend.emails.send({
        from: 'CodeSprint AI <onboarding@resend.dev>',
        to: email,
        subject: 'Reset your password – CodeSprint AI',
        html: passwordResetTemplate(name, url, theme),
      });
      if (error) {
        this.logger.error(`Resend error for ${email}`, error);
        throw new Error(error.message);
      }
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}`, error);
      throw error;
    }
  }
}
