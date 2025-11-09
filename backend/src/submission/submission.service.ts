// submission.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Submission } from './entities/Submission';
import { Repository } from 'typeorm';
import { Problem } from '../problem/entities/Problem';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SubmissionCommand } from './command/SubmissionCommand';
import { SubmissionStatus } from './enum/SubmissionStatus';
import { SubmissionDto } from './dto/SubmissionDto';

@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission) private repo: Repository<Submission>,
    @InjectRepository(Problem) private problemRepo: Repository<Problem>,
    @InjectQueue('submissions') private submissionQueue: Queue
  ) {}

  async createSubmission(command: SubmissionCommand, user: any) {
    const problem = command.problemUuid ? await this.problemRepo.findOne({ where: { uuid: command.problemUuid }, relations: ['testCases'] })
      : await this.problemRepo.findOne({ where: { slug: command.slug }, relations: ['testCases'] });

    if (!problem) throw new Error('Problem not found');

    const submission = this.repo.create({
      user,
      problem,
      code: command.code,
      language: command.language,
      status: SubmissionStatus.PENDING
    });
    await this.repo.save(submission);

    // enqueue
    await this.submissionQueue.add('process', { submissionId: submission.uuid, userId: user.id }, { attempts: 3, backoff: 2000 });

    // mark queued
    submission.status = SubmissionStatus.QUEUED;
    await this.repo.save(submission);

    return submission;
  }

  async getSubmissionsByUuid(submissionUuid: string) : Promise<SubmissionDto> {
    const submissions = await this.repo.findOne({
      where: {uuid: submissionUuid },
    });
    if (!submissions) throw new Error('Submission not found');
    return SubmissionDto.toDto(submissions) ;
  }

  // get submissions by problem UUID
  async getSubmissionsByProblemUuid(problemUuid: string) : Promise<SubmissionDto[]> {
    const submissions = await this.repo.find({
      where: { problem: { uuid: problemUuid } },
      order: { createdAt: 'DESC' },
    });
    return submissions.map(SubmissionDto.toDto);
  }
}
