import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserStats } from './entities/UserStats';
import { Problem } from '../problem/entities/Problem';
import { Submission } from '../submission/entities/Submission';
import { SubmissionStatus } from '../submission/enum/SubmissionStatus';
import { DifficultyEnum } from '../problem/enum/DifficultyEnum';

/**
 * UserStatsService
 * 
 * Handles updating user statistics when submissions are accepted.
 * Manages solved counts, streaks, and other stats.
 */
@Injectable()
export class UserStatsService {
    private readonly logger = new Logger(UserStatsService.name);

    constructor(
        @InjectRepository(UserStats)
        private readonly statsRepo: Repository<UserStats>,
        @InjectRepository(Submission)
        private readonly submissionRepo: Repository<Submission>,
        @InjectRepository(Problem)
        private readonly problemRepo: Repository<Problem>,
    ) { }

    /**
     * Update user stats when a submission is accepted.
     * - Increments solved count if this is the first accepted submission for this problem
     * - Updates streak based on consecutive days of submissions
     */
    async updateStatsOnAcceptedSubmission(
        userUuid: string,
        problemUuid: string,
    ): Promise<void> {
        try {
            // Get or create user stats
            let stats = await this.statsRepo.findOne({ where: { userId: userUuid } });
            if (!stats) {
                stats = this.statsRepo.create({ userId: userUuid });
                stats = await this.statsRepo.save(stats);
            }

            // Check if user already solved this problem before
            const previouslyAccepted = await this.submissionRepo
                .createQueryBuilder('s')
                .innerJoin('s.user', 'u')
                .where('u.uuid = :userUuid', { userUuid })
                .andWhere('s.problem.uuid = :problemUuid', { problemUuid })
                .andWhere('s.status = :status', { status: SubmissionStatus.ACCEPTED })
                .getCount();

            // If this is the first accepted submission for this problem, update solved counts
            // Note: We check for > 1 because the current submission is already saved as ACCEPTED
            if (previouslyAccepted <= 1) {
                // Get problem difficulty
                const problem = await this.problemRepo.findOne({ where: { uuid: problemUuid } });
                if (problem) {
                    stats.totalSolved += 1;

                    switch (problem.difficulty) {
                        case DifficultyEnum.EASY:
                            stats.easySolved += 1;
                            break;
                        case DifficultyEnum.MEDIUM:
                            stats.mediumSolved += 1;
                            break;
                        case DifficultyEnum.HARD:
                            stats.hardSolved += 1;
                            break;
                    }

                    this.logger.log(`Updated solved count for user ${userUuid}: total=${stats.totalSolved}`);
                }
            }

            // Update streak
            this.updateStreak(stats);

            // Save updated stats
            await this.statsRepo.save(stats);
        } catch (error) {
            this.logger.error(`Failed to update stats for user ${userUuid}`, error);
            // Don't throw - stats update shouldn't break submission flow
        }
    }

    /**
     * Update streak based on consecutive days of submissions.
     * - If last submission was yesterday: increment streak
     * - If last submission was today: do nothing (already counted)
     * - Otherwise: reset streak to 1
     */
    private updateStreak(stats: UserStats): void {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (stats.lastSubmissionDate) {
            const lastDate = new Date(stats.lastSubmissionDate);
            lastDate.setHours(0, 0, 0, 0);

            if (lastDate.getTime() === today.getTime()) {
                // Already submitted today, don't change streak
                return;
            } else if (lastDate.getTime() === yesterday.getTime()) {
                // Last submission was yesterday, increment streak
                stats.currentStreak += 1;
            } else {
                // Streak broken, reset to 1
                stats.currentStreak = 1;
            }
        } else {
            // First submission ever
            stats.currentStreak = 1;
        }

        // Update max streak if current exceeds it
        if (stats.currentStreak > stats.maxStreak) {
            stats.maxStreak = stats.currentStreak;
        }

        // Update last submission date
        stats.lastSubmissionDate = today;

        this.logger.log(`Updated streak: current=${stats.currentStreak}, max=${stats.maxStreak}`);
    }

    /**
     * Recalculate all stats for a user from scratch.
     * Useful for fixing corrupted data or after migrations.
     */
    async recalculateStats(userUuid: string): Promise<UserStats> {
        this.logger.log(`Starting stats recalculation for user ${userUuid}`);

        try {
            let stats = await this.statsRepo.findOne({ where: { userId: userUuid } });
            this.logger.log(`Existing stats found: ${!!stats}`);

            if (!stats) {
                stats = this.statsRepo.create({ userId: userUuid });
                this.logger.log(`Created new stats record for user ${userUuid}`);
            }

            // Count unique solved problems by difficulty
            this.logger.log('Querying solved problems...');
            const solvedProblems = await this.submissionRepo
                .createQueryBuilder('s')
                .select('DISTINCT p.uuid', 'problemUuid')
                .addSelect('p.difficulty', 'difficulty')
                .innerJoin('s.problem', 'p')
                .innerJoin('s.user', 'u')
                .where('u.uuid = :userUuid', { userUuid })
                .andWhere('s.status = :status', { status: SubmissionStatus.ACCEPTED })
                .getRawMany<{ problemUuid: string; difficulty: DifficultyEnum }>();

            this.logger.log(`Found ${solvedProblems.length} unique solved problems`);


            stats.totalSolved = solvedProblems.length;
            stats.easySolved = solvedProblems.filter(p => p.difficulty === DifficultyEnum.EASY).length;
            stats.mediumSolved = solvedProblems.filter(p => p.difficulty === DifficultyEnum.MEDIUM).length;
            stats.hardSolved = solvedProblems.filter(p => p.difficulty === DifficultyEnum.HARD).length;

            // Recalculate streak from submission history
            const submissions = await this.submissionRepo
                .createQueryBuilder('s')
                .select("DATE(s.createdAt)", 'date')
                .innerJoin('s.user', 'u')
                .where('u.uuid = :userUuid', { userUuid })
                .andWhere('s.status = :status', { status: SubmissionStatus.ACCEPTED })
                .groupBy("DATE(s.createdAt)")
                .orderBy('date', 'ASC')
                .getRawMany<{ date: string }>();

            if (submissions.length > 0) {
                let currentStreak = 1;
                let maxStreak = 1;

                for (let i = 1; i < submissions.length; i++) {
                    const prevDate = new Date(submissions[i - 1].date);
                    const currDate = new Date(submissions[i].date);
                    const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

                    if (diffDays === 1) {
                        currentStreak++;
                        if (currentStreak > maxStreak) {
                            maxStreak = currentStreak;
                        }
                    } else if (diffDays > 1) {
                        currentStreak = 1;
                    }
                }

                // Check if streak is still active (last submission was today or yesterday)
                const lastSubmissionDate = new Date(submissions[submissions.length - 1].date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);

                if (lastSubmissionDate.getTime() !== today.getTime() &&
                    lastSubmissionDate.getTime() !== yesterday.getTime()) {
                    currentStreak = 0; // Streak is broken
                }

                stats.currentStreak = currentStreak;
                stats.maxStreak = maxStreak;
                stats.lastSubmissionDate = lastSubmissionDate;
            }

            return this.statsRepo.save(stats);
        } catch (error) {
            this.logger.error(`Failed to recalculate stats for user ${userUuid}`, error);
            throw error;
        }
    }
}
