import { Badge, BadgeTier } from '../entities/Badge';
import { UserBadge } from '../entities/UserBadge';

export class BadgeDto {
    uuid: string;
    name: string;
    description: string;
    icon: string;
    tier: BadgeTier;
    unlockedAt?: string;

    static fromBadge(badge: Badge): BadgeDto {
        return {
            uuid: badge.uuid,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            tier: badge.tier,
        };
    }

    static fromUserBadge(userBadge: UserBadge): BadgeDto {
        return {
            uuid: userBadge.badge.uuid,
            name: userBadge.badge.name,
            description: userBadge.badge.description,
            icon: userBadge.badge.icon,
            tier: userBadge.badge.tier,
            unlockedAt: userBadge.unlockedAt.toISOString(),
        };
    }
}
