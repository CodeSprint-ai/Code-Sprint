import {
    Injectable,
    Logger,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ProblemHint } from './entities/problem-hint.entity';
import { HintUsage } from './entities/hint-usage.entity';
import { HintGenerationService } from './hint-generation.service';

/**
 * Penalty per hint level. Capped at 50 total.
 */
const HINT_PENALTIES: Record<number, number> = {
    1: 5,
    2: 10,
    3: 15,
    4: 20,
};

const MAX_PENALTY = 50;

@Injectable()
export class HintService {
    private readonly logger = new Logger(HintService.name);

    constructor(
        @InjectRepository(ProblemHint)
        private readonly hintRepo: Repository<ProblemHint>,
        @InjectRepository(HintUsage)
        private readonly usageRepo: Repository<HintUsage>,
        private readonly dataSource: DataSource,
        private readonly generationService: HintGenerationService,
    ) { }

    /**
     * Get the next hint for a user on a specific problem.
     * Uses a database transaction with pessimistic locking to prevent double-charging.
     */
    async getNextHint(
        userUuid: string,
        problemUuid: string,
        preferredLang: string = 'python',
    ) {
        return await this.dataSource.transaction(async (manager) => {
            // 1. Pessimistic lock on usage to prevent double-charging from concurrent clicks
            let usage = await manager.findOne(HintUsage, {
                where: { userUuid, problemUuid },
                lock: { mode: 'pessimistic_write' },
            });

            if (!usage) {
                usage = manager.create(HintUsage, {
                    userUuid,
                    problemUuid,
                    scorePenalty: 0,
                    levelReached: 0,
                    hintsUsedAt: [],
                });
            }

            if (usage.levelReached >= 4) {
                throw new BadRequestException(
                    'All hints exhausted for this problem. No more hints available.',
                );
            }

            const nextLevel = usage.levelReached + 1;

            // 2. Fetch pre-generated hint (language-specific only for Level 4)
            const hintLanguage = nextLevel === 4 ? preferredLang : 'python';
            let hint = await manager.findOne(ProblemHint, {
                where: { problemUuid, level: nextLevel, language: hintLanguage },
            });

            // 3. Live fallback: generate on-the-fly if no pre-generated hint exists
            if (!hint) {
                this.logger.log(
                    `No pre-generated hint for problem ${problemUuid} level ${nextLevel}, generating live...`,
                );

                const content = await this.generationService.generateSingleHint(
                    problemUuid,
                    nextLevel,
                    preferredLang,
                );

                hint = manager.create(ProblemHint, {
                    problemUuid,
                    level: nextLevel,
                    content,
                    language: hintLanguage,
                });

                await manager.save(ProblemHint, hint);
            }

            // 4. Apply penalty (capped at MAX_PENALTY)
            const penalty = HINT_PENALTIES[nextLevel] || 0;
            usage.scorePenalty = Math.min(usage.scorePenalty + penalty, MAX_PENALTY);
            usage.levelReached = nextLevel;
            usage.hintsUsedAt = [
                ...usage.hintsUsedAt,
                { level: nextLevel, timestamp: new Date().toISOString() },
            ];

            await manager.save(HintUsage, usage);

            this.logger.log(
                `User ${userUuid} used hint level ${nextLevel} on problem ${problemUuid} (penalty: ${usage.scorePenalty})`,
            );

            return {
                hintUuid: hint.uuid,
                level: nextLevel,
                content: hint.content,
                totalPenalty: usage.scorePenalty,
                hintsRemaining: 4 - nextLevel,
            };
        });
    }

    /**
     * Get the current hint usage state for a user on a problem (for frontend display).
     */
    async getUsage(userUuid: string, problemUuid: string) {
        const usage = await this.usageRepo.findOne({
            where: { userUuid, problemUuid },
        });

        if (!usage) {
            return {
                levelReached: 0,
                scorePenalty: 0,
                hintsUsedAt: [],
                hintsRemaining: 4,
            };
        }

        // Fetch all hints the user has already seen (up to their current level)
        const revealedHints = await this.hintRepo
            .createQueryBuilder('hint')
            .where('hint.problemUuid = :problemUuid', { problemUuid })
            .andWhere('hint.level <= :level', { level: usage.levelReached })
            .orderBy('hint.level', 'ASC')
            .getMany();

        return {
            levelReached: usage.levelReached,
            scorePenalty: usage.scorePenalty,
            hintsUsedAt: usage.hintsUsedAt,
            hintsRemaining: 4 - usage.levelReached,
            hints: revealedHints.map((h) => ({
                uuid: h.uuid,
                level: h.level,
                content: h.content,
            })),
        };
    }

    /**
     * Submit feedback on a specific hint (useful / not useful).
     * Uses atomic increment to avoid race conditions.
     */
    async rateFeedback(hintUuid: string, isUseful: boolean) {
        const hint = await this.hintRepo.findOne({ where: { uuid: hintUuid } });

        if (!hint) {
            throw new NotFoundException(`Hint ${hintUuid} not found`);
        }

        const incrementField = isUseful ? 'usefulCount' : 'notUsefulCount';
        await this.hintRepo.increment({ uuid: hintUuid }, incrementField, 1);

        return { success: true };
    }
}
