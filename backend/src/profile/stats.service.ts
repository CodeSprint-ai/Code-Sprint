import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from '../submission/entities/Submission';
import { Problem } from '../problem/entities/Problem';
import { SubmissionStatus } from '../submission/enum/SubmissionStatus';
import { DifficultyEnum } from '../problem/enum/DifficultyEnum';
import {
    DifficultyDistribution,
    LanguageUsage,
    SubmissionHeatmapEntry,
    SolvedOverTimeEntry,
    UserStatsDto,
} from './dto/UserStatsDto';

/**
 * StatsService
 * 
 * Handles efficient aggregation queries for user statistics.
 * Uses raw SQL where needed for optimal performance.
 */
@Injectable()
export class StatsService {
    constructor(
        @InjectRepository(Submission)
        private readonly submissionRepo: Repository<Submission>,
        @InjectRepository(Problem)
        private readonly problemRepo: Repository<Problem>,
    ) { }

    /**
     * Calculate problems solved by difficulty for a user
     */
    async calculateDifficultyStats(userUuid: string): Promise<DifficultyDistribution> {
        // Get unique solved problems by difficulty
        const solvedQuery = this.submissionRepo
            .createQueryBuilder('s')
            .select('p.difficulty', 'difficulty')
            .addSelect('COUNT(DISTINCT p.uuid)', 'count')
            .innerJoin('s.problem', 'p')
            .where('s.user.uuid = :userUuid', { userUuid })
            .andWhere('s.status = :status', { status: SubmissionStatus.ACCEPTED })
            .groupBy('p.difficulty');

        const solvedResults = await solvedQuery.getRawMany<{ difficulty: DifficultyEnum; count: string }>();

        // Get total problems by difficulty
        const totalQuery = this.problemRepo
            .createQueryBuilder('p')
            .select('p.difficulty', 'difficulty')
            .addSelect('COUNT(*)', 'count')
            .groupBy('p.difficulty');

        const totalResults = await totalQuery.getRawMany<{ difficulty: DifficultyEnum; count: string }>();

        const solvedMap = new Map(solvedResults.map(r => [r.difficulty, parseInt(r.count)]));
        const totalMap = new Map(totalResults.map(r => [r.difficulty, parseInt(r.count)]));

        return {
            easy: {
                solved: solvedMap.get(DifficultyEnum.EASY) || 0,
                total: totalMap.get(DifficultyEnum.EASY) || 0,
            },
            medium: {
                solved: solvedMap.get(DifficultyEnum.MEDIUM) || 0,
                total: totalMap.get(DifficultyEnum.MEDIUM) || 0,
            },
            hard: {
                solved: solvedMap.get(DifficultyEnum.HARD) || 0,
                total: totalMap.get(DifficultyEnum.HARD) || 0,
            },
        };
    }

    /**
     * Calculate language usage distribution
     */
    async calculateLanguageStats(userUuid: string): Promise<LanguageUsage> {
        const query = this.submissionRepo
            .createQueryBuilder('s')
            .select('s.language', 'language')
            .addSelect('COUNT(*)', 'count')
            .where('s.user.uuid = :userUuid', { userUuid })
            .andWhere('s.language IS NOT NULL')
            .groupBy('s.language');

        const results = await query.getRawMany<{ language: string; count: string }>();

        const total = results.reduce((sum, r) => sum + parseInt(r.count), 0);
        const usage: LanguageUsage = {};

        results.forEach(r => {
            usage[r.language] = Math.round((parseInt(r.count) / total) * 1000) / 10;
        });

        return usage;
    }

    /**
     * Get submission counts grouped by date for heatmap (past 365 days)
     */
    async getSubmissionHeatmap(userUuid: string): Promise<SubmissionHeatmapEntry[]> {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const query = this.submissionRepo
            .createQueryBuilder('s')
            .select("TO_CHAR(s.createdAt, 'YYYY-MM-DD')", 'date')
            .addSelect('COUNT(*)', 'count')
            .where('s.user.uuid = :userUuid', { userUuid })
            .andWhere('s.createdAt >= :startDate', { startDate: oneYearAgo })
            .groupBy("TO_CHAR(s.createdAt, 'YYYY-MM-DD')")
            .orderBy('date', 'ASC');

        const results = await query.getRawMany<{ date: string; count: string }>();

        return results.map(r => ({
            date: r.date,
            count: parseInt(r.count),
        }));
    }

    /**
     * Get cumulative solved count over time (monthly)
     */
    async getSolvedOverTime(userUuid: string): Promise<SolvedOverTimeEntry[]> {
        // Get first accepted submission date for each problem, grouped by month
        const query = this.submissionRepo
            .createQueryBuilder('s')
            .select("TO_CHAR(MIN(s.createdAt), 'YYYY-MM')", 'month')
            .addSelect('COUNT(DISTINCT s.problem.uuid)', 'count')
            .where('s.user.uuid = :userUuid', { userUuid })
            .andWhere('s.status = :status', { status: SubmissionStatus.ACCEPTED })
            .groupBy("TO_CHAR(s.createdAt, 'YYYY-MM')")
            .orderBy('month', 'ASC');

        const results = await query.getRawMany<{ month: string; count: string }>();

        // Convert to cumulative
        let cumulative = 0;
        return results.map(r => {
            cumulative += parseInt(r.count);
            return { month: r.month, cumulative };
        });
    }

    /**
     * Get submission success rate
     */
    async getSubmissionRate(userUuid: string): Promise<{ total: number; accepted: number }> {
        const totalQuery = this.submissionRepo
            .createQueryBuilder('s')
            .where('s.user.uuid = :userUuid', { userUuid })
            .getCount();

        const acceptedQuery = this.submissionRepo
            .createQueryBuilder('s')
            .where('s.user.uuid = :userUuid', { userUuid })
            .andWhere('s.status = :status', { status: SubmissionStatus.ACCEPTED })
            .getCount();

        const [total, accepted] = await Promise.all([totalQuery, acceptedQuery]);
        return { total, accepted };
    }

    /**
     * Get complete stats DTO for a user
     */
    async getCompleteStats(userUuid: string): Promise<UserStatsDto> {
        const [difficultyDistribution, languageUsage, submissionHeatmap, solvedOverTime, submissionRate] =
            await Promise.all([
                this.calculateDifficultyStats(userUuid),
                this.calculateLanguageStats(userUuid),
                this.getSubmissionHeatmap(userUuid),
                this.getSolvedOverTime(userUuid),
                this.getSubmissionRate(userUuid),
            ]);

        return UserStatsDto.create(
            difficultyDistribution,
            languageUsage,
            submissionHeatmap,
            solvedOverTime,
            submissionRate.total,
            submissionRate.accepted,
        );
    }
}
