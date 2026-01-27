import { User, SocialLinks } from '../../user/entities/user.model';
import { UserLevel } from '../../user/enum/UserLevel';

export interface PublicUserStatsDto {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    submissionSuccessRate: number;
    currentStreak: number;
    maxStreak: number;
    rating: number;
    rank?: number;
}

export interface RecentBadgeDto {
    name: string;
    icon: string;
    tier: string;
    unlockedAt: string;
}

export class PublicProfileDto {
    username: string;
    name: string;
    avatarUrl?: string;
    bio?: string;
    country?: string;
    socialLinks: SocialLinks;
    level: UserLevel;
    stats: PublicUserStatsDto;
    recentBadges: RecentBadgeDto[];
    joinedAt: string;

    static toDto(
        user: User,
        stats: PublicUserStatsDto,
        recentBadges: RecentBadgeDto[],
        rank?: number,
    ): PublicProfileDto {
        return {
            username: user.username || '',
            name: user.name || '',
            avatarUrl: user.avatarUrl,
            bio: user.bio,
            country: user.country,
            socialLinks: user.socialLinks || {},
            level: user.level,
            stats: { ...stats, rank },
            recentBadges,
            joinedAt: user.createdAt.toISOString(),
        };
    }
}
