import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoadmapService } from './roadmap.service';
import { MasteryAggregatorService } from './mastery-aggregator.service';
import { StatsCronService } from './stats-cron.service';
import { RoadmapController } from './roadmap.controller';
import { UserTopicMastery } from './entities/user-topic-mastery.entity';
import { ProblemDifficultyStats } from './entities/problem-difficulty-stats.entity';
import { UserRoadmap } from './entities/user-roadmap.entity';
import { RoadmapBadge } from './entities/roadmap-badge.entity';
import { MasteryHistory } from './entities/mastery-history.entity';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        TypeOrmModule.forFeature([
            UserTopicMastery,
            ProblemDifficultyStats,
            UserRoadmap,
            RoadmapBadge,
            MasteryHistory,
        ]),
    ],
    providers: [RoadmapService, MasteryAggregatorService, StatsCronService],
    controllers: [RoadmapController],
    exports: [MasteryAggregatorService],
})
export class RoadmapModule { }
