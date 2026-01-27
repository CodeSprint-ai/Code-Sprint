import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Badge, BadgeCriteriaType } from './entities/Badge';
import { UserBadge } from './entities/UserBadge';
import { UserStats } from './entities/UserStats';
import { BadgeDto } from './dto/BadgeDto';
import { AppLogger } from '../common/services/logger.service';

/**
 * BadgeService
 * 
 * Handles badge evaluation and unlocking.
 * Called after each submission completion.
 */
@Injectable()
export class BadgeService {
    constructor(
        @InjectRepository(Badge)
        private readonly badgeRepo: Repository<Badge>,
        @InjectRepository(UserBadge)
        private readonly userBadgeRepo: Repository<UserBadge>,
        @InjectRepository(UserStats)
        private readonly statsRepo: Repository<UserStats>,
        private readonly logger: AppLogger,
    ) { }

    /**
     * Get all badges for a user
     */
    async getUserBadges(userUuid: string): Promise<BadgeDto[]> {
        const userBadges = await this.userBadgeRepo.find({
            where: { userId: userUuid },
            order: { unlockedAt: 'DESC' },
        });

        return userBadges.map(BadgeDto.fromUserBadge);
    }

    /**
     * Get all available badges
     */
    async getAllBadges(): Promise<BadgeDto[]> {
        const badges = await this.badgeRepo.find({
            where: { isActive: true },
            order: { tier: 'ASC' },
        });

        return badges.map(BadgeDto.fromBadge);
    }

    /**
     * Evaluate and unlock earned badges for a user
     * Called after submission completion
     */
    async evaluateBadges(userUuid: string): Promise<BadgeDto[]> {
        const stats = await this.statsRepo.findOne({ where: { userId: userUuid } });
        if (!stats) {
            return [];
        }

        const allBadges = await this.badgeRepo.find({ where: { isActive: true } });
        const existingBadgeIds = (await this.userBadgeRepo.find({ where: { userId: userUuid } }))
            .map(ub => ub.badgeId);

        const newlyUnlocked: Badge[] = [];

        for (const badge of allBadges) {
            // Skip if already unlocked
            if (existingBadgeIds.includes(badge.uuid)) {
                continue;
            }

            // Check if criteria is met
            if (this.isCriteriaMet(badge, stats)) {
                const userBadge = this.userBadgeRepo.create({
                    userId: userUuid,
                    badgeId: badge.uuid,
                });
                await this.userBadgeRepo.save(userBadge);
                newlyUnlocked.push(badge);
                this.logger.info(`Badge unlocked: ${badge.name} for user ${userUuid}`, BadgeService.name);
            }
        }

        return newlyUnlocked.map(BadgeDto.fromBadge);
    }

    /**
     * Check if badge criteria is met
     */
    private isCriteriaMet(badge: Badge, stats: UserStats): boolean {
        const { type, value } = badge.criteria;

        switch (type) {
            case BadgeCriteriaType.SOLVED_COUNT:
                return stats.totalSolved >= value;

            case BadgeCriteriaType.EASY_COUNT:
                return stats.easySolved >= value;

            case BadgeCriteriaType.MEDIUM_COUNT:
                return stats.mediumSolved >= value;

            case BadgeCriteriaType.HARD_COUNT:
                return stats.hardSolved >= value;

            case BadgeCriteriaType.STREAK_DAYS:
                return stats.maxStreak >= value;

            case BadgeCriteriaType.SUBMISSION_COUNT:
                return stats.totalSubmissions >= value;

            case BadgeCriteriaType.CONTEST_PARTICIPATION:
                return stats.contestsParticipated >= value;

            case BadgeCriteriaType.RATING_THRESHOLD:
                return stats.rating >= value;

            default:
                return false;
        }
    }
}
