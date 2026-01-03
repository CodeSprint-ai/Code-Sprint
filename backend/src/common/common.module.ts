import { Module } from '@nestjs/common';
import { MailService } from './services/mail.service';
import { RequestContextService } from './services/request-context.service';
import { AppLogger } from './services/logger.service';
import { SubmissionGateway } from './utils/socket-gateway';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [],
  providers: [MailService, RequestContextService, AppLogger, SubmissionGateway, JwtStrategy, JwtService],
  exports: [MailService, RequestContextService, AppLogger, SubmissionGateway],
  controllers: [],
})
export class CommonModule { }
