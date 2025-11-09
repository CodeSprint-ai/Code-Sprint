import { Module } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { RequestContextService } from './services/request-context.service';
import { AppLogger } from './services/logger.service';
import { Judge0Service } from './services/judge.service';
import { SubmissionGateway } from './utils/socket-gateway';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  imports: [],
  providers: [MailService, RequestContextService, AppLogger,Judge0Service,SubmissionGateway,JwtStrategy],
  exports: [MailService, RequestContextService, AppLogger, Judge0Service,SubmissionGateway],
  controllers: [],
})
export class CommonModule { }
