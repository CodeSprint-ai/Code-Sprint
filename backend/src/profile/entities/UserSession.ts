import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.model';

/**
 * UserSession Entity
 * 
 * Tracks active user sessions for security management.
 */
@Entity('user_sessions')
export class UserSession {
    @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
    uuid: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @Column({ name: 'device', type: 'varchar', length: 255, nullable: true })
    device?: string;

    @Column({ name: 'browser', type: 'varchar', length: 100, nullable: true })
    browser?: string;

    @Column({ name: 'os', type: 'varchar', length: 100, nullable: true })
    os?: string;

    @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
    ipAddress?: string;

    @Column({ name: 'location', type: 'varchar', length: 255, nullable: true })
    location?: string;

    @Column({ name: 'is_current', type: 'boolean', default: false })
    isCurrent: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'last_active_at' })
    lastActiveAt: Date;
}
