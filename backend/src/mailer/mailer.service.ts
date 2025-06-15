import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from './dto/send.email.dto';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { html } from 'src/common/utils/emailTemplate';
@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}

  mailTransport = () => {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });

    return transporter;
  };

  template(html: string, replacement: Record<string, string>) {
    return html.replace(
      /%(\w*)%/g, // or /{(\w*)}/g for "{this} instead of %this%"
      function (p, key) {
        return replacement.hasOwnProperty(key) ? replacement[key] : '';
      },
    );
  }

  async sendEmail(sendEmailDto: SendEmailDto) {
    const { from, recipients, subject } = sendEmailDto;

    console.log(sendEmailDto.placeholderReplacement);

    const customizedHtml = sendEmailDto.placeholderReplacement
      ? this.template(html, sendEmailDto.placeholderReplacement)
      : html;

    const transport = this.mailTransport();

    const options: MailOptions = {
      from: from ?? {
        name: this.configService.get<string>('APP_NAME'),
        address: this.configService.get<string>('DEFAULT_MAIL_FROM'),
      },
      html: customizedHtml,
      to: recipients,
      subject,
    };

    try {
      const result = transport.sendMail(options);
      return result;
    } catch (error) {
      throw error;
    }
  }
}
