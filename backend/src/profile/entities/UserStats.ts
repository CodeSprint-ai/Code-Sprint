import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.model';

/**
 * UserStats Entity
 * 
 * Denormalized stats table for efficient profile rendering.
 * Updated on each submission completion via event system.
 */
@Entity('user_stats')
export class UserStats {
    @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
    uuid: string;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    // Problem counts by difficulty
    @Column({ name: 'total_solved', type: 'int', default: 0 })
    totalSolved: number;

    @Column({ name: 'easy_solved', type: 'int', default: 0 })
    easySolved: number;

    @Column({ name: 'medium_solved', type: 'int', default: 0 })
    mediumSolved: number;

    @Column({ name: 'hard_solved', type: 'int', default: 0 })
    hardSolved: number;

    // Submission statistics
    @Column({ name: 'total_submissions', type: 'int', default: 0 })
    totalSubmissions: number;

    @Column({ name: 'accepted_submissions', type: 'int', default: 0 })
    acceptedSubmissions: number;

    // Streak tracking
    @Column({ name: 'current_streak', type: 'int', default: 0 })
    currentStreak: number;

    @Column({ name: 'max_streak', type: 'int', default: 0 })
    maxStreak: number;

    @Column({ name: 'last_submission_date', type: 'date', nullable: true })
    lastSubmissionDate: Date | null;

    // Contest stats
    @Column({ name: 'contests_participated', type: 'int', default: 0 })
    contestsParticipated: number;

    @Column({ name: 'best_contest_rank', type: 'int', nullable: true })
    bestContestRank: number | null;

    @Column({ name: 'rating', type: 'int', default: 0 })
    rating: number;

    // Cache invalidation
    @UpdateDateColumn({ name: 'last_calculated_at' })
    lastCalculatedAt: Date;
}
