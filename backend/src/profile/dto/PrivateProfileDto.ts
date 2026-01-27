import { User, SocialLinks } from '../../user/entities/user.model';
import { UserLevel } from '../../user/enum/UserLevel';
import { RoleEnum } from '../../user/enum/RoleEnum';
import { ThemePreference, DefaultLanguage } from '../entities/UserPreferences';

export interface PrivateUserPreferencesDto {
    theme: ThemePreference;
    defaultLanguage: DefaultLanguage;
    emailNotifications: boolean;
    marketingEmails: boolean;
    showActivityStatus: boolean;
}

export interface PrivateStatsDto {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    totalSubmissions: number;
    acceptedSubmissions: number;
    currentStreak: number;
    maxStreak: number;
    contestsParticipated: number;
    rating: number;
}

export class PrivateProfileDto {
    uuid: string;
    username: string;
    email: string;
    name: string;
    avatarUrl?: string;
    bio?: string;
    country?: string;
    socialLinks: SocialLinks;
    level: UserLevel;
    role: RoleEnum;
    isVerified: boolean;
    stats: PrivateStatsDto;
    preferences: PrivateUserPreferencesDto;
    joinedAt: string;

    static toDto(
        user: User,
        stats: PrivateStatsDto,
        preferences: PrivateUserPreferencesDto,
    ): PrivateProfileDto {
        return {
            uuid: user.uuid,
            username: user.username || '',
            email: user.email,
            name: user.name || '',
            avatarUrl: user.avatarUrl,
            bio: user.bio,
            country: user.country,
            socialLinks: user.socialLinks || {},
            level: user.level,
            role: user.role,
            isVerified: user.isVerified,
            stats,
            preferences,
            joinedAt: user.createdAt.toISOString(),
        };
    }
}
