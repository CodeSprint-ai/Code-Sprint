import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.model';

export enum ThemePreference {
    LIGHT = 'LIGHT',
    DARK = 'DARK',
    SYSTEM = 'SYSTEM',
}

export enum DefaultLanguage {
    JAVA = 'java',
    PYTHON = 'python',
    CPP = 'cpp',
}

/**
 * UserPreferences Entity
 * 
 * Stores user preferences and settings.
 */
@Entity('user_preferences')
export class UserPreferences {
    @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
    uuid: string;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @Column({ name: 'theme', type: 'enum', enum: ThemePreference, default: ThemePreference.SYSTEM })
    theme: ThemePreference;

    @Column({ name: 'default_language', type: 'enum', enum: DefaultLanguage, default: DefaultLanguage.PYTHON })
    defaultLanguage: DefaultLanguage;

    @Column({ name: 'email_notifications', type: 'boolean', default: true })
    emailNotifications: boolean;

    @Column({ name: 'marketing_emails', type: 'boolean', default: false })
    marketingEmails: boolean;

    @Column({ name: 'show_activity_status', type: 'boolean', default: true })
    showActivityStatus: boolean;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
