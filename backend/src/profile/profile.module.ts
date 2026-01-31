import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { StatsService } from './stats.service';
import { UserStatsService } from './user-stats.service';
import { BadgeService } from './badge.service';
import { User } from '../user/entities/user.model';
import { Submission } from '../submission/entities/Submission';
import { Problem } from '../problem/entities/Problem';
import { UserStats } from './entities/UserStats';
import { Badge } from './entities/Badge';
import { UserBadge } from './entities/UserBadge';
import { UserPreferences } from './entities/UserPreferences';
import { SavedProblem } from './entities/SavedProblem';
import { UserSession } from './entities/UserSession';
import { CommonModule } from '../common/common.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            Submission,
            Problem,
            UserStats,
            Badge,
            UserBadge,
            UserPreferences,
            SavedProblem,
            UserSession,
        ]),
        CacheModule.register({
            ttl: 3600, // 1 hour default TTL
            max: 100, // Maximum number of items in cache
        }),
        CommonModule,
    ],
    controllers: [ProfileController],
    providers: [ProfileService, StatsService, UserStatsService, BadgeService],
    exports: [ProfileService, StatsService, UserStatsService, BadgeService],
})
export class ProfileModule { }

