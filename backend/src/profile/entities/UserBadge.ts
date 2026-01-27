import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    Unique,
    Column,
} from 'typeorm';
import { User } from '../../user/entities/user.model';
import { Badge } from './Badge';

/**
 * UserBadge Entity
 * 
 * Join table tracking which badges a user has unlocked.
 */
@Entity('user_badges')
@Unique(['userId', 'badgeId'])
export class UserBadge {
    @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
    uuid: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @ManyToOne(() => Badge, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'badge_id' })
    badge: Badge;

    @Column({ name: 'badge_id', type: 'uuid' })
    badgeId: string;

    @CreateDateColumn({ name: 'unlocked_at' })
    unlockedAt: Date;
}
