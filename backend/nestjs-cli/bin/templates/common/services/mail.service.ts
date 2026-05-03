import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendEmailVerification(email: string, token: string) {
    const url = `http://localhost:5000/auth/verify-email?token=${token}`;
    return this.resend.emails.send({
      from: 'CodeSprint AI <onboarding@resend.dev>',
      to: email,
      subject: 'Verify your email',
      html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
    });
  }

  async sendPasswordReset(email: string, token: string) {
    const url = `http://localhost:5000/auth/reset-password?token=${token}`;
    return this.resend.emails.send({
      from: 'CodeSprint AI <onboarding@resend.dev>',
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${url}">here</a> to reset your password. This link will expire in 15 minutes.</p>`,
    });
  }
}
