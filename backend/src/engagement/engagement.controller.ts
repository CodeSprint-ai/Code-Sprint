import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Public } from '../common/decorators/publicDecorator';
import { Roles } from '../common/decorators/roleDecorater';
import { RateLimit, RateLimiterGuard } from '../auth/guards/rate-limiter.guard';
import { ContactDto, WaitlistDto } from './engagement.dto';
import { EngagementService } from './engagement.service';

@Controller('engagement')
export class EngagementController {
  constructor(private readonly service: EngagementService) {}
  @Public()
  @Post('waitlist')
  @UseGuards(RateLimiterGuard)
  @RateLimit({
    maxAttempts: 5,
    windowSeconds: 3600,
    keyGenerator: (req) => `waitlist:${req.ip}`,
  })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  waitlist(@Body() dto: WaitlistDto) {
    return this.service.joinWaitlist(dto);
  }

  @Public()
  @Post('contact')
  @UseGuards(RateLimiterGuard)
  @RateLimit({
    maxAttempts: 5,
    windowSeconds: 3600,
    keyGenerator: (req) => `contact:${req.ip}`,
  })
  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  contact(@Body() dto: ContactDto) {
    return this.service.contact(dto);
  }

  @Delete('inbox/:uuid')
  @Roles('ADMIN')
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.service.remove(uuid);
  }

  @Get('inbox')
  @Roles('ADMIN')
  inbox() {
    return this.service.list();
  }
}
