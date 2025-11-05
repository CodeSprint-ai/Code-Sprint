import { Module } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { RequestContextService } from './services/request-context.service';
import { AppLogger } from './services/logger.service';

@Module({
  imports: [],
  providers: [MailService, RequestContextService, AppLogger],
  exports: [MailService, RequestContextService, AppLogger],
  controllers: [],
})
export class CommonModule {}
