import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { User } from '../user/entities/user.model';
import { UserStats } from './entities/UserStats';
import { UserPreferences, ThemePreference, DefaultLanguage } from './entities/UserPreferences';
import { UserBadge } from './entities/UserBadge';
import { SavedProblem } from './entities/SavedProblem';
import { Problem } from '../problem/entities/Problem';
import { UpdateProfileCommand } from './commands/UpdateProfileCommand';
import { UpdatePreferencesCommand } from './commands/UpdatePreferencesCommand';
import { SaveProblemCommand, UpdateSavedProblemCommand } from './commands/SaveProblemCommand';
import { PublicProfileDto, PublicUserStatsDto, RecentBadgeDto } from './dto/PublicProfileDto';
import { PrivateProfileDto, PrivateStatsDto, PrivateUserPreferencesDto } from './dto/PrivateProfileDto';
import { SavedProblemDto } from './dto/SavedProblemDto';
import { StatsService } from './stats.service';
import { AppLogger } from '../common/services/logger.service';

const CACHE_TTL_SECONDS = 3600; // 1 hour

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectRepository(UserStats)
        private readonly statsRepo: Repository<UserStats>,
        @InjectRepository(UserPreferences)
        private readonly prefsRepo: Repository<UserPreferences>,
        @InjectRepository(UserBadge)
        private readonly userBadgeRepo: Repository<UserBadge>,
        @InjectRepository(SavedProblem)
        private readonly savedProblemRepo: Repository<SavedProblem>,
        @InjectRepository(Problem)
        private readonly problemRepo: Repository<Problem>,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache,
        private readonly statsService: StatsService,
        private readonly logger: AppLogger,
    ) { }

    /**
     * Get public profile by username
     */
    async getPublicProfile(username: string): Promise<PublicProfileDto> {
        const cacheKey = `profile:public:${username}`;
        const cached = await this.cacheManager.get<PublicProfileDto>(cacheKey);
        if (cached) {
            this.logger.debug(`Cache hit for public profile: ${username}`, ProfileService.name);
            return cached;
        }

        const user = await this.userRepo.findOne({ where: { username } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const [stats, recentBadges, rank] = await Promise.all([
            this.getPublicStats(user.uuid),
            this.getRecentBadges(user.uuid),
            this.getUserRank(user.uuid),
        ]);

        const profileDto = PublicProfileDto.toDto(user, stats, recentBadges, rank);

        await this.cacheManager.set(cacheKey, profileDto, CACHE_TTL_SECONDS);
        return profileDto;
    }

    /**
     * Get private profile for authenticated user
     */
    async getPrivateProfile(userUuid: string): Promise<PrivateProfileDto> {
        const user = await this.userRepo.findOne({ where: { uuid: userUuid } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const [stats, preferences] = await Promise.all([
            this.getPrivateStats(userUuid),
            this.getOrCreatePreferences(userUuid),
        ]);

        const prefsDto: PrivateUserPreferencesDto = {
            theme: preferences.theme,
            defaultLanguage: preferences.defaultLanguage,
            emailNotifications: preferences.emailNotifications,
            marketingEmails: preferences.marketingEmails,
            showActivityStatus: preferences.showActivityStatus,
        };

        return PrivateProfileDto.toDto(user, stats, prefsDto);
    }

    /**
     * Update user profile
     */
    async updateProfile(userUuid: string, command: UpdateProfileCommand): Promise<User> {
        const user = await this.userRepo.findOne({ where: { uuid: userUuid } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Check username uniqueness if updating
        if (command.username && command.username !== user.username) {
            const existing = await this.userRepo.findOne({ where: { username: command.username } });
            if (existing) {
                throw new ConflictException('Username already taken');
            }
        }

        // Update fields
        if (command.username !== undefined) user.username = command.username;
        if (command.name !== undefined) user.name = command.name;
        if (command.avatarUrl !== undefined) user.avatarUrl = command.avatarUrl;
        if (command.bio !== undefined) user.bio = command.bio;
        if (command.country !== undefined) user.country = command.country;
        if (command.socialLinks !== undefined) {
            user.socialLinks = { ...user.socialLinks, ...command.socialLinks };
        }

        const updated = await this.userRepo.save(user);

        // Invalidate cache
        await this.invalidateProfileCache(user.username);

        this.logger.info(`Profile updated for user: ${userUuid}`, ProfileService.name);
        return updated;
    }

    /**
     * Update user preferences
     */
    async updatePreferences(userUuid: string, command: UpdatePreferencesCommand): Promise<UserPreferences> {
        const prefs = await this.getOrCreatePreferences(userUuid);

        if (command.theme !== undefined) prefs.theme = command.theme;
        if (command.defaultLanguage !== undefined) prefs.defaultLanguage = command.defaultLanguage;
        if (command.emailNotifications !== undefined) prefs.emailNotifications = command.emailNotifications;
        if (command.marketingEmails !== undefined) prefs.marketingEmails = command.marketingEmails;
        if (command.showActivityStatus !== undefined) prefs.showActivityStatus = command.showActivityStatus;

        return this.prefsRepo.save(prefs);
    }

    /**
     * Save a problem (bookmark)
     */
    async saveProblem(userUuid: string, command: SaveProblemCommand): Promise<SavedProblem> {
        const problem = await this.problemRepo.findOne({ where: { uuid: command.problemUuid } });
        if (!problem) {
            throw new NotFoundException('Problem not found');
        }

        // Check if already saved
        const existing = await this.savedProblemRepo.findOne({
            where: { userId: userUuid, problemId: command.problemUuid },
        });
        if (existing) {
            throw new ConflictException('Problem already saved');
        }

        const saved = this.savedProblemRepo.create({
            userId: userUuid,
            problemId: command.problemUuid,
            notes: command.notes,
        });

        return this.savedProblemRepo.save(saved);
    }

    /**
     * Get saved problems for a user
     */
    async getSavedProblems(userUuid: string): Promise<SavedProblemDto[]> {
        const saved = await this.savedProblemRepo.find({
            where: { userId: userUuid },
            order: { savedAt: 'DESC' },
        });

        return saved.map(SavedProblemDto.fromEntity);
    }

    /**
     * Update saved problem notes
     */
    async updateSavedProblem(
        userUuid: string,
        savedProblemUuid: string,
        command: UpdateSavedProblemCommand,
    ): Promise<SavedProblem> {
        const saved = await this.savedProblemRepo.findOne({
            where: { uuid: savedProblemUuid, userId: userUuid },
        });
        if (!saved) {
            throw new NotFoundException('Saved problem not found');
        }

        if (command.notes !== undefined) saved.notes = command.notes;
        return this.savedProblemRepo.save(saved);
    }

    /**
     * Remove a saved problem
     */
    async removeSavedProblem(userUuid: string, savedProblemUuid: string): Promise<void> {
        const result = await this.savedProblemRepo.delete({
            uuid: savedProblemUuid,
            userId: userUuid,
        });
        if (result.affected === 0) {
            throw new NotFoundException('Saved problem not found');
        }
    }

    // ===================== PRIVATE HELPERS =====================

    private async getPublicStats(userUuid: string): Promise<PublicUserStatsDto> {
        let stats = await this.statsRepo.findOne({ where: { userId: userUuid } });

        // Create stats if not exists
        if (!stats) {
            stats = this.statsRepo.create({ userId: userUuid });
            stats = await this.statsRepo.save(stats);
        }

        const { total, accepted } = await this.statsService.getSubmissionRate(userUuid);

        return {
            totalSolved: stats.totalSolved,
            easySolved: stats.easySolved,
            mediumSolved: stats.mediumSolved,
            hardSolved: stats.hardSolved,
            submissionSuccessRate: total > 0 ? Math.round((accepted / total) * 1000) / 10 : 0,
            currentStreak: stats.currentStreak,
            maxStreak: stats.maxStreak,
            rating: stats.rating,
        };
    }

    private async getPrivateStats(userUuid: string): Promise<PrivateStatsDto> {
        let stats = await this.statsRepo.findOne({ where: { userId: userUuid } });

        if (!stats) {
            stats = this.statsRepo.create({ userId: userUuid });
            stats = await this.statsRepo.save(stats);
        }

        const { total, accepted } = await this.statsService.getSubmissionRate(userUuid);

        return {
            totalSolved: stats.totalSolved,
            easySolved: stats.easySolved,
            mediumSolved: stats.mediumSolved,
            hardSolved: stats.hardSolved,
            totalSubmissions: total,
            acceptedSubmissions: accepted,
            currentStreak: stats.currentStreak,
            maxStreak: stats.maxStreak,
            contestsParticipated: stats.contestsParticipated,
            rating: stats.rating,
        };
    }

    private async getRecentBadges(userUuid: string, limit = 5): Promise<RecentBadgeDto[]> {
        const userBadges = await this.userBadgeRepo.find({
            where: { userId: userUuid },
            order: { unlockedAt: 'DESC' },
            take: limit,
        });

        return userBadges.map(ub => ({
            name: ub.badge.name,
            icon: ub.badge.icon,
            tier: ub.badge.tier,
            unlockedAt: ub.unlockedAt.toISOString().split('T')[0],
        }));
    }

    private async getUserRank(userUuid: string): Promise<number | undefined> {
        // Simple rank based on total solved count
        const result = await this.statsRepo
            .createQueryBuilder('s')
            .select('COUNT(*) + 1', 'rank')
            .where('s.totalSolved > (SELECT total_solved FROM user_stats WHERE user_id = :userUuid)', { userUuid })
            .getRawOne<{ rank: string }>();

        return result ? parseInt(result.rank) : undefined;
    }

    private async getOrCreatePreferences(userUuid: string): Promise<UserPreferences> {
        let prefs = await this.prefsRepo.findOne({ where: { userId: userUuid } });

        if (!prefs) {
            prefs = this.prefsRepo.create({
                userId: userUuid,
                theme: ThemePreference.SYSTEM,
                defaultLanguage: DefaultLanguage.PYTHON,
                emailNotifications: true,
                marketingEmails: false,
                showActivityStatus: true,
            });
            prefs = await this.prefsRepo.save(prefs);
        }

        return prefs;
    }

    private async invalidateProfileCache(username?: string): Promise<void> {
        if (username) {
            await this.cacheManager.del(`profile:public:${username}`);
        }
    }
}
