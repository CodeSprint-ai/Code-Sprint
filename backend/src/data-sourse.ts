import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from './user/entities/user.model';
import { Problem } from './problem/entities/Problem';
import { TestCase } from './problem/entities/TestCase';
import { Submission } from './submission/entities/Submission';
import { SprintSession } from './sprint/entities/SprintSession';
import { SprintProblem } from './sprint/entities/SprintProblem';
import { UserStats } from './profile/entities/UserStats';
import { Badge } from './profile/entities/Badge';
import { UserBadge } from './profile/entities/UserBadge';
import { UserPreferences } from './profile/entities/UserPreferences';
import { SavedProblem } from './profile/entities/SavedProblem';
import { UserSession } from './profile/entities/UserSession';
import { DocumentEmbedding } from './entities/DocumentEmbedding';
import { ProblemHint } from './ai/hints/entities/problem-hint.entity';
import { HintUsage } from './ai/hints/entities/hint-usage.entity';
import { UserTopicMastery } from './roadmap/entities/user-topic-mastery.entity';
import { ProblemDifficultyStats } from './roadmap/entities/problem-difficulty-stats.entity';
import { UserRoadmap } from './roadmap/entities/user-roadmap.entity';
import { RoadmapBadge } from './roadmap/entities/roadmap-badge.entity';

// Load environment variables
config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon') ? { rejectUnauthorized: false } : false,
  synchronize: false,
  logging: true,
  entities: [
    User,
    Problem,
    TestCase,
    Submission,
    SprintSession,
    SprintProblem,
    UserStats,
    Badge,
    UserBadge,
    UserPreferences,
    SavedProblem,
    UserSession,
    DocumentEmbedding,
    ProblemHint,
    HintUsage,
    UserTopicMastery,
    ProblemDifficultyStats,
    UserRoadmap,
    RoadmapBadge,
  ],
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});

