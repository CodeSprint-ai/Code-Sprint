import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../common/common.module';
import { EngagementRequest } from './engagement.entity';
import { EngagementService } from './engagement.service';
import { EngagementController } from './engagement.controller';
import { RateLimiterGuard } from '../auth/guards/rate-limiter.guard';
@Module({
  imports: [TypeOrmModule.forFeature([EngagementRequest]), CommonModule],
  providers: [EngagementService, RateLimiterGuard],
  controllers: [EngagementController],
})
export class EngagementModule {}
