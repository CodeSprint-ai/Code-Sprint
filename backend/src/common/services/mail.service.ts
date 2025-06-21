import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendEmailVerification(email: string, token: string) {
    const url = `http://localhost:5000/auth/verify-email?token=${token}`;
    return this.transporter.sendMail({
      to: email,
      subject: 'Verify your email',
      html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`,
    });
  }

  async sendPasswordReset(email: string, token: string) {
    const url = `http://localhost:5000/auth/reset-password?token=${token}`;
    return this.transporter.sendMail({
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${url}">here</a> to reset your password. This link will expire in 15 minutes.</p>`,
    });
  }
}
