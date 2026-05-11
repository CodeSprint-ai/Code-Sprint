import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

export enum BadgeTier {
    BRONZE = 'BRONZE',
    SILVER = 'SILVER',
    GOLD = 'GOLD',
    PLATINUM = 'PLATINUM',
}

export enum BadgeCriteriaType {
    SOLVED_COUNT = 'SOLVED_COUNT',
    STREAK_DAYS = 'STREAK_DAYS',
    EASY_COUNT = 'EASY_COUNT',
    MEDIUM_COUNT = 'MEDIUM_COUNT',
    HARD_COUNT = 'HARD_COUNT',
    SUBMISSION_COUNT = 'SUBMISSION_COUNT',
    CONTEST_PARTICIPATION = 'CONTEST_PARTICIPATION',
    RATING_THRESHOLD = 'RATING_THRESHOLD',
    LANGUAGE_MASTERY = 'LANGUAGE_MASTERY',
    // Sprint-specific criteria
    SPRINT_HARD_IN_SESSION = 'SPRINT_HARD_IN_SESSION',   // Hard solved in a single sprint session
    SPRINT_MEDIUM_CUMULATIVE = 'SPRINT_MEDIUM_CUMULATIVE', // Medium solved across all sprints (cumulative)
    SPRINT_HARD_CUMULATIVE = 'SPRINT_HARD_CUMULATIVE',     // Hard solved across all sprints (cumulative)
    POINTS_MILESTONE = 'POINTS_MILESTONE',                 // Total rating crosses a threshold
    FIRST_SPRINT = 'FIRST_SPRINT',                         // First sprint completed
}

export interface BadgeCriteria {
    type: BadgeCriteriaType;
    value: number;
    language?: string; // For LANGUAGE_MASTERY type
}

/**
 * Badge Entity
 * 
 * Defines achievement badges that users can unlock.
 */
@Entity('badges')
export class Badge {
    @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
    uuid: string;

    @Column({ name: 'name', type: 'varchar', length: 100, unique: true })
    name: string;

    @Column({ name: 'description', type: 'text' })
    description: string;

    @Column({ name: 'icon', type: 'varchar', length: 100 })
    icon: string;

    @Column({ name: 'tier', type: 'enum', enum: BadgeTier })
    tier: BadgeTier;

    @Column({ name: 'criteria', type: 'jsonb' })
    criteria: BadgeCriteria;

    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
