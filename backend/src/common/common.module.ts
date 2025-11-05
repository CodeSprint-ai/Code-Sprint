import { Module } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { RequestContextService } from './services/request-context.service';
import { AppLogger } from './services/logger.service';
import { Judge0Service } from './services/judge.service';
import { SocketGateway } from './utils/socket-gateway';

@Module({
  imports: [],
  providers: [MailService, RequestContextService, AppLogger,Judge0Service,SocketGateway],
  exports: [MailService, RequestContextService, AppLogger, Judge0Service,SocketGateway],
  controllers: [],
})
export class CommonModule { }
