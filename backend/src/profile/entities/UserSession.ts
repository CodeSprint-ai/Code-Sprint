import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';
import { User } from '../../user/entities/user.model';

/**
 * UserSession Entity
 * 
 * Tracks active user sessions for security management.
 * Each session has its own refresh token for multi-device support.
 */
@Entity('user_sessions')
@Index(['userId', 'isRevoked'])
export class UserSession {
    @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
    uuid: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    /**
     * Hashed refresh token for this specific session.
     * Each session has a unique refresh token.
     */
    @Column({ name: 'refresh_token_hash', type: 'varchar', length: 255 })
    refreshTokenHash: string;

    /**
     * Session expiration timestamp.
     * After this time, the session is considered expired.
     */
    @Column({ name: 'expires_at', type: 'timestamptz' })
    expiresAt: Date;

    /**
     * Soft revocation flag.
     * When true, the session is no longer valid.
     */
    @Column({ name: 'is_revoked', type: 'boolean', default: false })
    isRevoked: boolean;

    /**
     * Full user agent string for detailed device identification.
     */
    @Column({ name: 'user_agent', type: 'text', nullable: true })
    userAgent?: string;

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
