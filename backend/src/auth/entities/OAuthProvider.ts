import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
    Unique,
} from 'typeorm';
import { User } from '../../user/entities/user.model';
import { ProviderEnum } from '../enum/ProviderEnum';

/**
 * OAuthProvider Entity
 * 
 * Tracks linked OAuth providers per user.
 * Allows users to link multiple providers (Google, GitHub, etc.) to a single account.
 */
@Entity('oauth_providers')
@Unique(['userId', 'provider'])
@Index(['provider', 'providerId'])
export class OAuthProvider {
    @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
    uuid: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    /**
     * OAuth provider (Google, GitHub, etc.)
     */
    @Column({ name: 'provider', type: 'enum', enum: ProviderEnum })
    provider: ProviderEnum;

    /**
     * Unique ID from the OAuth provider.
     */
    @Column({ name: 'provider_id', type: 'varchar', length: 255 })
    providerId: string;

    /**
     * Email associated with this OAuth account.
     * May differ from user's primary email.
     */
    @Column({ name: 'email', type: 'varchar', length: 255, nullable: true })
    email?: string;

    /**
     * Display name from OAuth provider.
     */
    @Column({ name: 'display_name', type: 'varchar', length: 255, nullable: true })
    displayName?: string;

    /**
     * Avatar URL from OAuth provider.
     */
    @Column({ name: 'avatar_url', type: 'varchar', length: 500, nullable: true })
    avatarUrl?: string;

    /**
     * Raw profile data from OAuth provider.
     */
    @Column({ name: 'profile_data', type: 'jsonb', default: '{}' })
    profileData: Record<string, any>;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
