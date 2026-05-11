import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SprintSession, DifficultyBreakdown } from './entities/SprintSession';
import { DataSource, Repository } from 'typeorm';
import { User } from '../user/entities/user.model';
import { Problem } from '../problem/entities/Problem';
import { SprintProblem } from './entities/SprintProblem';
import { Submission } from '../submission/entities/Submission';
import { DifficultyEnum } from '../problem/enum/DifficultyEnum';
import { UserLevel } from '../user/enum/UserLevel';
import { SubmissionStatus } from '../submission/enum/SubmissionStatus';
import { SprintStatus } from './enum/SprintStatus';
import { UserStats } from '../profile/entities/UserStats';
import { BadgeService } from '../profile/badge.service';
import { BadgeDto } from '../profile/dto/BadgeDto';
import { Judge0Service } from '../judge/judge.service';
import { RunnerFactory } from '../judge/runners/runner.factory';
import { normalizeLanguage, LanguageId } from '../judge/enums/language.enum';
import { FinishSprintDto } from './dto/FinishSprintDto';

import { CreateSprintCommand } from './command/CreateSprintCommand';
import { SprintDto } from './dto/SprintDto';
import { SprintCompletionDto } from './dto/SprintCompletionDto';

/**
 * Points awarded per difficulty level in a sprint
 */
const POINTS_BY_DIFFICULTY: Record<string, number> = {
  [DifficultyEnum.EASY]: 10,
  [DifficultyEnum.MEDIUM]: 20,
  [DifficultyEnum.HARD]: 30,
};

/**
 * Level thresholds based on total points (rating)
 */
function getLevelFromPoints(totalPoints: number): UserLevel {
  if (totalPoints >= 601) return UserLevel.EXPERT;
  if (totalPoints >= 301) return UserLevel.ADVANCED;
  if (totalPoints >= 101) return UserLevel.INTERMEDIATE;
  return UserLevel.BEGINNER;
}

/**
 * Points needed to reach the next level from current points
 */
function getPointsToNextLevel(totalPoints: number): number {
  if (totalPoints >= 601) return 0; // Already Expert
  if (totalPoints >= 301) return 601 - totalPoints;
  if (totalPoints >= 101) return 301 - totalPoints;
  return 101 - totalPoints;
}

@Injectable()
export class SprintService {
  private readonly logger = new Logger(SprintService.name);

  constructor(
    @InjectRepository(SprintSession)
    private sprintRepo: Repository<SprintSession>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Problem)
    private problemRepo: Repository<Problem>,
    @InjectRepository(SprintProblem)
    private sprintProblemRepo: Repository<SprintProblem>,
    @InjectRepository(Submission)
    private submissionRepo: Repository<Submission>,
    @InjectRepository(UserStats)
    private statsRepo: Repository<UserStats>,
    private readonly dataSource: DataSource,
    private readonly badgeService: BadgeService,
    private readonly judge0: Judge0Service,
    private readonly runnerFactory: RunnerFactory,
  ) { }

  /**
   * Create a new sprint session with randomized problems.
   * Selects: 1 Easy, 2 Medium, 2 Hard = 5 problems total.
   */
  async createSprint(command: CreateSprintCommand): Promise<SprintDto> {
    const user = await this.userRepo.findOne({ where: { uuid: command.userId } });
    if (!user) throw new NotFoundException('User not found');

    // Select 5 problems: 1 Easy, 2 Medium, 2 Hard
    const easyProblems = await this.problemRepo
      .createQueryBuilder('problem')
      .where('problem.difficulty = :difficulty', { difficulty: DifficultyEnum.EASY })
      .orderBy('RANDOM()')
      .take(1)
      .getMany();

    const mediumProblems = await this.problemRepo
      .createQueryBuilder('problem')
      .where('problem.difficulty = :difficulty', { difficulty: DifficultyEnum.MEDIUM })
      .orderBy('RANDOM()')
      .take(2)
      .getMany();

    const hardProblems = await this.problemRepo
      .createQueryBuilder('problem')
      .where('problem.difficulty = :difficulty', { difficulty: DifficultyEnum.HARD })
      .orderBy('RANDOM()')
      .take(2)
      .getMany();

    const selectedProblems = [...easyProblems, ...mediumProblems, ...hardProblems];

    const startTime = new Date();
    const durationMinutes = command.durationMinutes || 60;
    const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

    const sprint = this.sprintRepo.create({
      user,
      startTime,
      endTime,
      status: SprintStatus.ACTIVE,
      totalQuestions: selectedProblems.length,
      sprintProblems: [],
    });

    const savedSprint = await this.sprintRepo.save(sprint);

    // Create SprintProblems
    let order = 1;
    for (const prob of selectedProblems) {
      const sp = this.sprintProblemRepo.create({
        sprintSession: savedSprint,
        problem: prob,
        order: order++,
        maxScore: POINTS_BY_DIFFICULTY[prob.difficulty] || 10,
      });
      await this.sprintProblemRepo.save(sp);
    }

    const result = await this.sprintRepo.findOne({
      where: { uuid: savedSprint.uuid },
      relations: ['user', 'sprintProblems', 'sprintProblems.problem'],
    });

    if (!result) {
      throw new NotFoundException('Sprint not found after creation');
    }

    return SprintDto.toDto(result);
  }

  /**
   * Finish a sprint session.
   *
   * This method:
   * 1. Calculates points based on difficulty (Easy=10, Medium=20, Hard=30)
   * 2. Updates user rating and level atomically in a transaction
   * 3. Updates streak tracking
   * 4. Evaluates and awards badges
   * 5. Returns full gamification response for frontend celebration UI
   *
   * Idempotency: Returns cached result if sprint already completed.
   * Transaction safety: All mutations wrapped in a single DB transaction.
   */
  async finishSprint(sprintId: string, userId: string, dto?: FinishSprintDto): Promise<SprintCompletionDto> {
    // Use a transaction with pessimistic locking to prevent race conditions
    return this.dataSource.transaction(async (manager) => {
      // Step 1: Lock ONLY the sprint row — no joins (PostgreSQL forbids FOR UPDATE on outer joins)
      const sprint = await manager
        .createQueryBuilder(SprintSession, 'sprint')
        .where('sprint.uuid = :id', { id: sprintId })
        .setLock('pessimistic_write')
        .getOne();

      if (!sprint) throw new NotFoundException('Sprint not found');

      // Step 2: Load the user separately to verify ownership
      const sprintWithUser = await manager.findOne(SprintSession, {
        where: { uuid: sprintId },
        relations: ['user'],
      });

      if (!sprintWithUser?.user || sprintWithUser.user.uuid !== userId) {
        throw new NotFoundException('Sprint not found');
      }

      // Attach user to the locked sprint object for later use
      sprint.user = sprintWithUser.user;

      // Idempotency: if already completed, return the cached result
      if (sprint.status === SprintStatus.COMPLETED) {
        const stats = await manager.findOne(UserStats, { where: { userId } });
        return {
          pointsEarned: sprint.score,
          totalPoints: stats?.rating || 0,
          newLevel: null,
          newBadges: [],
          updatedStreak: stats?.currentStreak || 0,
          correctAnswers: sprint.correctAnswers,
          totalQuestions: sprint.totalQuestions,
          difficultyBreakdown: sprint.difficultyBreakdown || { easy: 0, medium: 0, hard: 0 },
          sprintId: sprint.uuid,
        };
      }

      // ─── Judge each solution from the request body ─────────────────
      const solutions = dto?.solutions ?? [];
      this.logger.log(`[SPRINT] Received ${solutions.length} solutions for sprint ${sprintId}`);

      let acceptedEasy = 0;
      let acceptedMedium = 0;
      let acceptedHard = 0;
      let totalScore = 0;
      const solvedProblemIds = new Set<string>();

      for (const solution of solutions) {
        // Fetch problem with test cases
        const problem = await manager.findOne(Problem, {
          where: { uuid: solution.problemId },
          relations: ['testCases'],
        });

        if (!problem) {
          this.logger.warn(`[SPRINT] Problem ${solution.problemId} not found, skipping`);
          continue;
        }

        if (!problem.executionConfig || !problem.testCases?.length) {
          this.logger.warn(`[SPRINT] Problem ${problem.uuid} has no execution config or test cases, skipping`);
          continue;
        }

        let submissionStatus: SubmissionStatus = SubmissionStatus.INTERNAL_ERROR;

        try {
          // Build runner code (same as SubmissionProcessor)
          const normalizedLang = normalizeLanguage(solution.language);
          const runner = this.runnerFactory.getRunner(normalizedLang);
          const languageId = LanguageId[normalizedLang];
          const finalCode = runner.build(solution.code, problem.executionConfig);

          const encode = (str: string) => Buffer.from(str).toString('base64');
          const decode = (str: string | null) => str ? Buffer.from(str, 'base64').toString('utf-8') : null;

          // Bundle all test cases
          const stdinPayload = JSON.stringify({
            executionConfig: problem.executionConfig,
            tests: problem.testCases.map((tc) => ({
              input: tc.getInput(),
              expectedOutput: tc.getExpectedOutput(),
            })),
          });

          // Submit to Judge0
          const tokensResp = await this.judge0.submitBatch([{
            language_id: languageId,
            source_code: encode(finalCode),
            stdin: encode(stdinPayload),
            cpu_time_limit: problem.timeLimitSeconds ?? 5,
            memory_limit: (problem.memoryLimitMB ?? 128) * 1024,
          }]);

          const tokens = (tokensResp || []).map(t => t.token).filter((t): t is string => !!t);

          if (tokens.length > 0) {
            // Poll for result
            const results = await this.judge0.pollBatchUntilDone(tokens, 60_000, 800) || [];
            const judgeResponse = results[0];

            if (judgeResponse) {
              const statusId = judgeResponse.status?.id ?? judgeResponse.status_id ?? 13;

              if (statusId >= 3 && statusId <= 4) {
                // Status 3 = Accepted by Judge0 (code ran successfully)
                const stdout = decode(judgeResponse.stdout) ?? '';
                try {
                  const judgeResults = JSON.parse(stdout.trim());
                  if (Array.isArray(judgeResults)) {
                    const allPassed = judgeResults.every((jr: any) => jr.ok === true);
                    submissionStatus = allPassed ? SubmissionStatus.ACCEPTED : SubmissionStatus.WRONG_ANSWER;
                  }
                } catch {
                  submissionStatus = SubmissionStatus.WRONG_ANSWER;
                }
              } else if (statusId === 5) {
                submissionStatus = SubmissionStatus.TIME_LIMIT_EXCEEDED;
              } else if (statusId === 6) {
                submissionStatus = SubmissionStatus.COMPILATION_ERROR;
              } else {
                submissionStatus = SubmissionStatus.RUNTIME_ERROR;
              }
            }
          }
        } catch (judgeError) {
          this.logger.error(`[SPRINT] Judge failed for problem ${problem.uuid}:`, judgeError);
          submissionStatus = SubmissionStatus.INTERNAL_ERROR;
        }

        this.logger.log(`[SPRINT] Problem ${problem.uuid} | ${problem.difficulty} | Result: ${submissionStatus}`);

        // Save submission record for history
        const sub = manager.create(Submission, {
          code: solution.code,
          language: solution.language,
          status: submissionStatus,
          finishedAt: new Date(),
        });
        sub.user = { uuid: userId } as User;
        sub.problem = { uuid: problem.uuid } as Problem;
        sub.sprintSession = { uuid: sprintId } as SprintSession;
        await manager.save(Submission, sub);

        // Score if accepted
        if (submissionStatus === SubmissionStatus.ACCEPTED && !solvedProblemIds.has(problem.uuid)) {
          solvedProblemIds.add(problem.uuid);

          const difficulty = problem.difficulty;
          const points = POINTS_BY_DIFFICULTY[difficulty] || 10;
          totalScore += points;

          if (difficulty === DifficultyEnum.EASY) acceptedEasy++;
          if (difficulty === DifficultyEnum.MEDIUM) acceptedMedium++;
          if (difficulty === DifficultyEnum.HARD) acceptedHard++;
        }
      }

      const difficultyBreakdown: DifficultyBreakdown = {
        easy: acceptedEasy,
        medium: acceptedMedium,
        hard: acceptedHard,
      };

      // Update sprint record
      sprint.status = SprintStatus.COMPLETED;
      sprint.score = totalScore;
      sprint.correctAnswers = solvedProblemIds.size;
      sprint.difficultyBreakdown = difficultyBreakdown;
      sprint.completedAt = new Date();
      await manager.save(SprintSession, sprint);

      // Get or create user stats
      let stats = await manager.findOne(UserStats, { where: { userId } });
      if (!stats) {
        stats = manager.create(UserStats, { userId });
        stats = await manager.save(UserStats, stats);
      }

      // Record the previous level/rating to detect level-up
      const previousLevel = sprint.user.level;
      const previousRating = stats.rating;

      // Add sprint points to user rating
      stats.rating += totalScore;

      // Update streak
      this.updateStreak(stats);

      // Save updated stats
      await manager.save(UserStats, stats);

      // Determine new level
      const newLevel = getLevelFromPoints(stats.rating);
      const levelChanged = previousLevel !== newLevel;

      if (levelChanged) {
        sprint.user.level = newLevel;
        await manager.save(User, sprint.user);
        this.logger.log(`User ${userId} leveled up: ${previousLevel} → ${newLevel} (rating: ${stats.rating})`);
      }

      // Evaluate badges (wrapped in try/catch so badge failure doesn't break sprint)
      let newBadges: BadgeDto[] = [];
      try {
        newBadges = await this.badgeService.evaluateBadgesWithSprintContext(
          userId,
          stats,
          difficultyBreakdown,
          manager,
        );
      } catch (error) {
        this.logger.error(`Badge evaluation failed for user ${userId}, continuing without badges`, error);
      }

      this.logger.log(
        `Sprint ${sprintId} completed: score=${totalScore}, ` +
        `breakdown=E${acceptedEasy}/M${acceptedMedium}/H${acceptedHard}, ` +
        `newBadges=${newBadges.length}, streak=${stats.currentStreak}`
      );

      return {
        pointsEarned: totalScore,
        totalPoints: stats.rating,
        newLevel: levelChanged ? newLevel : null,
        newBadges,
        updatedStreak: stats.currentStreak,
        correctAnswers: solvedProblemIds.size,
        totalQuestions: sprint.totalQuestions,
        difficultyBreakdown,
        sprintId: sprint.uuid,
      };
    });
  }

  /**
   * Get recent sprint history for a user (last N sprints).
   */
  async getRecentSprints(userId: string, limit = 5): Promise<SprintDto[]> {
    const sprints = await this.sprintRepo.find({
      where: { user: { uuid: userId }, status: SprintStatus.COMPLETED },
      relations: ['user', 'sprintProblems', 'sprintProblems.problem'],
      order: { completedAt: 'DESC' },
      take: limit,
    });

    return sprints.map(SprintDto.toDto);
  }

  /**
   * Update streak based on consecutive days of sprints.
   * Uses lastSubmissionDate on UserStats for consistency.
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
        // Already submitted/sprinted today — don't change streak
        return;
      } else if (lastDate.getTime() === yesterday.getTime()) {
        // Last activity was yesterday — increment streak
        stats.currentStreak += 1;
      } else {
        // Streak broken — reset to 1
        stats.currentStreak = 1;
      }
    } else {
      // First activity ever
      stats.currentStreak = 1;
    }

    // Update max streak if current exceeds it
    if (stats.currentStreak > stats.maxStreak) {
      stats.maxStreak = stats.currentStreak;
    }

    // Update last submission date
    stats.lastSubmissionDate = today;
  }
}
