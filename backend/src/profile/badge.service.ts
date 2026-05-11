import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Badge, BadgeCriteriaType } from './entities/Badge';
import { UserBadge } from './entities/UserBadge';
import { UserStats } from './entities/UserStats';
import { BadgeDto } from './dto/BadgeDto';
import { AppLogger } from '../common/services/logger.service';

/**
 * BadgeService
 * 
 * Handles badge evaluation and unlocking.
 * Called after each submission completion and sprint completion.
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
     * Evaluate and unlock earned badges for a user.
     * Called after submission completion (non-sprint context).
     */
    async evaluateBadges(userUuid: string): Promise<BadgeDto[]> {
        const stats = await this.statsRepo.findOne({ where: { userId: userUuid } });
        if (!stats) {
            return [];
        }

        return this.doEvaluate(userUuid, stats);
    }

    /**
     * Evaluate badges with sprint context.
     * Called after sprint completion, includes sprint-specific criteria.
     * Optionally uses a transaction manager for atomic operations.
     */
    async evaluateBadgesWithSprintContext(
        userUuid: string,
        stats: UserStats,
        sprintBreakdown: { easy: number; medium: number; hard: number },
        manager?: EntityManager,
    ): Promise<BadgeDto[]> {
        return this.doEvaluate(userUuid, stats, sprintBreakdown, manager);
    }

    /**
     * Core badge evaluation logic.
     * Checks all active badges against user stats and optional sprint context.
     * Prevents duplicate awards via existing badge check.
     */
    private async doEvaluate(
        userUuid: string,
        stats: UserStats,
        sprintBreakdown?: { easy: number; medium: number; hard: number },
        manager?: EntityManager,
    ): Promise<BadgeDto[]> {
        const badgeRepo = manager?.getRepository(Badge) || this.badgeRepo;
        const userBadgeRepo = manager?.getRepository(UserBadge) || this.userBadgeRepo;

        const allBadges = await badgeRepo.find({ where: { isActive: true } });
        const existingBadgeIds = (await userBadgeRepo.find({ where: { userId: userUuid } }))
            .map(ub => ub.badgeId);

        const newlyUnlocked: Badge[] = [];

        for (const badge of allBadges) {
            // Skip if already unlocked
            if (existingBadgeIds.includes(badge.uuid)) {
                continue;
            }

            // Check if criteria is met
            if (this.isCriteriaMet(badge, stats, sprintBreakdown)) {
                try {
                    const userBadge = userBadgeRepo.create({
                        userId: userUuid,
                        badgeId: badge.uuid,
                    });
                    await userBadgeRepo.save(userBadge);
                    newlyUnlocked.push(badge);
                    this.logger.info(`Badge unlocked: ${badge.name} for user ${userUuid}`, BadgeService.name);
                } catch (error: any) {
                    // Handle unique constraint violation gracefully (race condition)
                    if (error?.code === '23505') {
                        this.logger.warn(`Badge ${badge.name} already awarded to ${userUuid} (duplicate)`, BadgeService.name);
                    } else {
                        this.logger.error(`Failed to award badge ${badge.name} to ${userUuid}`, BadgeService.name);
                    }
                }
            }
        }

        return newlyUnlocked.map(BadgeDto.fromBadge);
    }

    /**
     * Check if badge criteria is met based on user stats and optional sprint context.
     */
    private isCriteriaMet(
        badge: Badge,
        stats: UserStats,
        sprintBreakdown?: { easy: number; medium: number; hard: number },
    ): boolean {
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
                return stats.currentStreak >= value;

            case BadgeCriteriaType.SUBMISSION_COUNT:
                return stats.totalSubmissions >= value;

            case BadgeCriteriaType.CONTEST_PARTICIPATION:
                return stats.contestsParticipated >= value;

            case BadgeCriteriaType.RATING_THRESHOLD:
                return stats.rating >= value;

            // Sprint-specific criteria
            case BadgeCriteriaType.SPRINT_HARD_IN_SESSION:
                // "Problem Solver" (value=1) or "Challenge Seeker" (value=3)
                return (sprintBreakdown?.hard ?? 0) >= value;

            case BadgeCriteriaType.SPRINT_MEDIUM_CUMULATIVE:
                // "Medium Maestro" — cumulative medium solved across all sprints
                return stats.mediumSolved >= value;

            case BadgeCriteriaType.SPRINT_HARD_CUMULATIVE:
                // "Hard Hitter" — cumulative hard solved across all sprints
                return stats.hardSolved >= value;

            case BadgeCriteriaType.POINTS_MILESTONE:
                // "First Blood" (>0), "Century" (>=100), "Elite" (>=500)
                return stats.rating >= value;

            case BadgeCriteriaType.FIRST_SPRINT:
                // "First Blood" — first sprint completed (rating > 0)
                return stats.rating > 0;

            default:
                return false;
        }
    }
}
