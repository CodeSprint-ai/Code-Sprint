import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.model';
import { SecurityEventType } from '../enum/SecurityEventType';

/**
 * SecurityLog Entity
 * 
 * Audit logging for security-related events.
 * Tracks all authentication, session, and account events.
 */
@Entity('security_logs')
@Index(['userId', 'eventType'])
@Index(['createdAt'])
export class SecurityLog {
    @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
    uuid: string;

    /**
     * User associated with this event.
     * Nullable for events like failed logins with unknown users.
     */
    @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'user_id' })
    user?: User;

    @Column({ name: 'user_id', type: 'uuid', nullable: true })
    userId?: string;

    /**
     * Type of security event.
     */
    @Column({ name: 'event_type', type: 'enum', enum: SecurityEventType })
    eventType: SecurityEventType;

    /**
     * IP address from which the event originated.
     */
    @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
    ipAddress?: string;

    /**
     * User agent string for device identification.
     */
    @Column({ name: 'user_agent', type: 'text', nullable: true })
    userAgent?: string;

    /**
     * Additional metadata about the event.
     * Stores context-specific information in JSON format.
     */
    @Column({ name: 'metadata', type: 'jsonb', default: '{}' })
    metadata: Record<string, any>;

    /**
     * Optional session ID if event is session-related.
     */
    @Column({ name: 'session_id', type: 'uuid', nullable: true })
    sessionId?: string;

    /**
     * Whether the event was successful.
     */
    @Column({ name: 'success', type: 'boolean', default: true })
    success: boolean;

    /**
     * Error message if the event failed.
     */
    @Column({ name: 'error_message', type: 'text', nullable: true })
    errorMessage?: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
