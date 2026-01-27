import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
} from 'typeorm';
import { User } from '../../user/entities/user.model';
import { Problem } from '../../problem/entities/Problem';

/**
 * SavedProblem Entity
 * 
 * Bookmarked problems with optional notes.
 */
@Entity('saved_problems')
@Unique(['userId', 'problemId'])
export class SavedProblem {
    @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
    uuid: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @ManyToOne(() => Problem, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'problem_id' })
    problem: Problem;

    @Column({ name: 'problem_id', type: 'uuid' })
    problemId: string;

    @Column({ name: 'notes', type: 'text', nullable: true })
    notes?: string;

    @CreateDateColumn({ name: 'saved_at' })
    savedAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
