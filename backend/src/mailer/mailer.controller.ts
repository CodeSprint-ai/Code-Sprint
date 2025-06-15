import { Controller, Post } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendEmailDto } from './dto/send.email.dto';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}


  @Post('send-email')
  sendEmail(sendEmailDto: SendEmailDto) {
    return this.mailerService.sendEmail(sendEmailDto);
  }
}
