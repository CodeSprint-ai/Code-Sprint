// submission.service.ts
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Submission } from './entities/Submission';
import { Repository } from 'typeorm';
import { Problem } from '../problem/entities/Problem';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SubmissionCommand } from './command/SubmissionCommand';
import { SubmissionStatus } from './enum/SubmissionStatus';
import { SprintSession } from '../sprint/entities/SprintSession';
import { SubmissionDto } from './dto/SubmissionDto';
import { GetSubmissionsQueryDto } from './dto/GetSubmissionsQueryDto';
import { RoleEnum } from '../user/enum/RoleEnum';

type SubmissionReader = { uuid: string; role: RoleEnum };

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission) private repo: Repository<Submission>,
    @InjectRepository(Problem) private problemRepo: Repository<Problem>,
    @InjectQueue('submissions') private submissionQueue: Queue
  ) { }

  private userScope(user: SubmissionReader) {
    this.assertUserFilter(user);
    return user.role === RoleEnum.ADMIN ? {} : { user: { uuid: user.uuid } };
  }

  private assertUserFilter(user: SubmissionReader, userId?: string) {
    if (!user?.uuid) {
      throw new ForbiddenException('An authenticated user is required');
    }
    if (user.role !== RoleEnum.ADMIN && userId && userId !== user.uuid) {
      throw new ForbiddenException('You can only view your own submissions');
    }
  }

  async createSubmission(command: SubmissionCommand, user: any) {
    const problem = command.problemUuid ? await this.problemRepo.findOne({ where: { uuid: command.problemUuid }, relations: ['testCases'] })
      : await this.problemRepo.findOne({ where: { slug: command.slug }, relations: ['testCases'] });

    if (!problem) throw new Error('Problem not found');

    const submission = this.repo.create({
      user,
      problem,
      code: command.code,
      language: command.language,
      status: SubmissionStatus.PENDING,
      timeSpentMs: command.timeSpentMs,
    });

    // Link to sprint session if submitting during an active sprint
    if (command.sprintSessionId) {
      console.log('[SUB FIX] Linking submission to sprint:', command.sprintSessionId);
      submission.sprintSession = { uuid: command.sprintSessionId } as SprintSession;
    } else {
      console.log('[SUB DEBUG] No sprintSessionId provided in submission');
    }

    await this.repo.save(submission);

    // enqueue
    await this.submissionQueue.add('process', { submissionId: submission.uuid, userId: user.id }, { attempts: 3, backoff: 2000 });

    // mark queued
    submission.status = SubmissionStatus.QUEUED;
    await this.repo.save(submission);

    return submission;
  }

  async getSubmissionsByUuid(submissionUuid: string, requestingUser: SubmissionReader): Promise<SubmissionDto> {
    const submissions = await this.repo.findOne({
      where: { uuid: submissionUuid, ...this.userScope(requestingUser) },
    });
    if (!submissions) throw new NotFoundException('Submission not found');
    return SubmissionDto.toDto(submissions);
  }

  // get submissions by problem UUID
  async getSubmissionsByProblemUuid(problemUuid: string, requestingUser: SubmissionReader): Promise<SubmissionDto[]> {
    const submissions = await this.repo.find({
      where: { problem: { uuid: problemUuid }, ...this.userScope(requestingUser) },
      order: { createdAt: 'DESC' },
    });
    return submissions.map(SubmissionDto.toDto);
  }

  // get submissions by problem UUID
  async getSubmissionsByUserUuid(userUuid: string, requestingUser: SubmissionReader): Promise<SubmissionDto[]> {
    this.assertUserFilter(requestingUser, userUuid);
    const submissions = await this.repo.find({
      where: { user: { uuid: userUuid } },
      order: { createdAt: 'DESC' },
    });
    return submissions.map(SubmissionDto.toDto);
  }

  /**
   * Get paginated submissions with filters
   * Supports filtering by status, search (problem title or user name), date range, and userId
   */
  async getSubmissionsPaginated(
    query: GetSubmissionsQueryDto,
    requestingUser: SubmissionReader
  ): Promise<{
    data: SubmissionDto[];
    meta: {
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
    };
  }> {
    const {
      page = 1,
      pageSize = 10,
      status,
      search,
      userId,
      fromDate,
      toDate,
    } = query;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Build query builder
    const queryBuilder = this.repo
      .createQueryBuilder('submission')
      .leftJoinAndSelect('submission.user', 'user')
      .leftJoinAndSelect('submission.problem', 'problem')
      .orderBy('submission.createdAt', 'DESC');

    this.assertUserFilter(requestingUser, userId);
    const scopedUserId = requestingUser.role === RoleEnum.ADMIN ? userId : requestingUser.uuid;
    if (scopedUserId) {
      queryBuilder.andWhere('user.uuid = :userId', { userId: scopedUserId });
    }

    // Apply status filter
    if (status) {
      queryBuilder.andWhere('submission.status = :status', { status });
    }

    // Apply search filter (problem title or user name)
    if (search) {
      queryBuilder.andWhere(
        '(problem.title ILIKE :search OR user.name ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Apply date range filters
    if (fromDate) {
      queryBuilder.andWhere('submission.createdAt >= :fromDate', {
        fromDate: new Date(fromDate),
      });
    }
    if (toDate) {
      queryBuilder.andWhere('submission.createdAt <= :toDate', {
        toDate: new Date(toDate),
      });
    }

    // Get total count before pagination
    const total = await queryBuilder.getCount();

    // Apply pagination
    const submissions = await queryBuilder.skip(skip).take(take).getMany();

    // Calculate total pages
    const totalPages = Math.ceil(total / pageSize);

    return {
      data: submissions.map(SubmissionDto.toDto),
      meta: {
        total,
        page,
        pageSize,
        totalPages,
      },
    };
  }
}
