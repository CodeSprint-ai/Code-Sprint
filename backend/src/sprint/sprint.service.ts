import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SprintSession } from './entities/SprintSession';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.model';
import { Problem } from '../problem/entities/Problem';
import { SprintProblem } from './entities/SprintProblem';
import { Submission } from '../submission/entities/Submission';
import { DifficultyEnum } from '../problem/enum/DifficultyEnum';
import { UserLevel } from '../user/enum/UserLevel';
import { SubmissionStatus } from '../submission/enum/SubmissionStatus';
import { SprintStatus } from '../submission/enum/SprintStatus';

import { CreateSprintCommand } from './command/CreateSprintCommand';
import { SprintDto } from './dto/SprintDto';

@Injectable()
export class SprintService {
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
  ) { }

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
        maxScore: 100, // Default score
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

  async finishSprint(sprintId: string): Promise<SprintDto> {
    const sprint = await this.sprintRepo.findOne({
      where: { uuid: sprintId },
      relations: ['user', 'sprintProblems', 'sprintProblems.problem'],
    });

    if (!sprint) throw new NotFoundException('Sprint not found');
    if (sprint.status === SprintStatus.COMPLETED) return SprintDto.toDto(sprint);

    // Find all submissions for this sprint
    const submissions = await this.submissionRepo.find({
      where: { sprintSession: { uuid: sprintId } },
      relations: ['problem']
    });

    // Analyze results
    let acceptedEasy = 0;
    let acceptedMedium = 0;
    let acceptedHard = 0;
    let totalScore = 0;

    // Map to check if a problem was solved
    const solvedProblemIds = new Set<string>();

    for (const sub of submissions) {
      if (sub.status === SubmissionStatus.ACCEPTED) {
        if (!solvedProblemIds.has(sub.problem.uuid)) {
          solvedProblemIds.add(sub.problem.uuid);

          if (sub.problem.difficulty === DifficultyEnum.EASY) acceptedEasy++;
          if (sub.problem.difficulty === DifficultyEnum.MEDIUM) acceptedMedium++;
          if (sub.problem.difficulty === DifficultyEnum.HARD) acceptedHard++;

          totalScore += 10;
        }
      }
    }

    // Determine Level
    let newLevel = UserLevel.BEGINNER;
    if (acceptedHard >= 1 && acceptedMedium >= 1) {
      newLevel = UserLevel.EXPERT;
    } else if (acceptedMedium >= 1 && acceptedEasy >= 1) {
      newLevel = UserLevel.ADVANCED;
    } else if (acceptedEasy >= 1) {
      newLevel = UserLevel.INTERMEDIATE;
    }

    // Update User Level
    if (sprint.user.level !== newLevel) {
      sprint.user.level = newLevel;
      await this.userRepo.save(sprint.user);
    }

    sprint.status = SprintStatus.COMPLETED;
    sprint.score = totalScore;
    sprint.completedAt = new Date();

    const savedSprint = await this.sprintRepo.save(sprint);
    return SprintDto.toDto(savedSprint);
  }
}

