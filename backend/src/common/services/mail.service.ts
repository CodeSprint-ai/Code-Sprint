import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { emailVerificationTemplate } from './templates/email-verification.template';
import { passwordResetTemplate } from './templates/password-reset.template';
// import { otpEmailTemplate } from './templates/otp-email.template';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY is not set — emails will fail');
    }
    this.resend = new Resend(apiKey);
    this.from =
      this.configService.get<string>('MAIL_FROM') ||
      'CodeSprint AI <noreply@moinuddin.info>';
  }

  // ──────────────────────────────────────────────
  // Core reusable method
  // ──────────────────────────────────────────────

  /**
   * Send an email via Resend API.
   * All specific email methods delegate here.
   */
  async sendEmail(options: SendEmailOptions): Promise<void> {
    const { to, subject, html } = options;

    try {
      const { data, error } = await this.resend.emails.send({
        from: this.from,
        to,
        subject,
        html,
      });

      if (error) {
        this.logger.error(
          `Resend API error [to: ${to}, subject: "${subject}"]`,
          JSON.stringify(error),
        );
        throw new Error(error.message);
      }

      this.logger.log(
        `Email sent successfully [to: ${to}, id: ${data?.id}]`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send email [to: ${to}, subject: "${subject}"]`,
        error instanceof Error ? error.stack : JSON.stringify(error),
      );
      throw error;
    }
  }

  // ──────────────────────────────────────────────
  // Email-verification flow
  // ──────────────────────────────────────────────

  async sendEmailVerification(
    email: string,
    name: string,
    token: string,
    theme: 'dark' | 'light' = 'dark',
  ): Promise<void> {
    const frontendUrl =
      this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    const url = `${frontendUrl}/auth/verify-email?token=${token}`;

    await this.sendEmail({
      to: email,
      subject: 'Verify your email – CodeSprint AI',
      html: emailVerificationTemplate(name, url, theme),
    });

    this.logger.log(`Verification email sent to ${email}`);
  }

  // ──────────────────────────────────────────────
  // Password-reset flow
  // ──────────────────────────────────────────────

  async sendPasswordReset(
    email: string,
    name: string,
    token: string,
    theme: 'dark' | 'light' = 'dark',
  ): Promise<void> {
    const frontendUrl =
      this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
    const url = `${frontendUrl}/auth/reset-password?token=${token}`;

    await this.sendEmail({
      to: email,
      subject: 'Reset your password – CodeSprint AI',
      html: passwordResetTemplate(name, url, theme),
    });

    this.logger.log(`Password reset email sent to ${email}`);
  }

  // ──────────────────────────────────────────────
  // OTP flow
  // ──────────────────────────────────────────────

//   async sendOtp(
//     email: string,
//     name: string,
//     otp: string,
//     theme: 'dark' | 'light' = 'dark',
//   ): Promise<void> {
//     await this.sendEmail({
//       to: email,
//       subject: `${otp} – Your CodeSprint AI verification code`,
//       html: otpEmailTemplate(name, otp, theme),
//     });

//     this.logger.log(`OTP email sent to ${email}`);
//   }
}
