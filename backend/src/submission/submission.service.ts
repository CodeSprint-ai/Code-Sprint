import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Submission } from './entities/Submission';
import { Repository } from 'typeorm';
import { SprintSession } from '../sprint/entities/SprintSession';
import { Problem } from '../problem/entities/Problem';
import { User } from '../user/entities/user.model';
import { SubmissionDto } from './dto/SubmissionDto';
import { SubmissionCommand } from './command/SubmissionCommand';


@Injectable()
export class SubmissionService {
  constructor(
    @InjectRepository(Submission)
    private submissionRepo: Repository<Submission>,
    @InjectRepository(SprintSession)
    private sprintRepo: Repository<SprintSession>,
    @InjectRepository(Problem)
    private problemRepo: Repository<Problem>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createSubmission(cmd: SubmissionCommand): Promise<SubmissionDto> {
    const user = await this.userRepo.findOne({ where: { uuid: cmd.userId } });
    const problem = await this.problemRepo.findOne({
      where: { uuid: cmd.problemId },
    });
    if (!user || !problem)
      throw new NotFoundException('User or Problem not found');

    let sprint: any = null;
    if (cmd.sprintSessionId) {
      sprint = await this.sprintRepo.findOne({
        where: { uuid: cmd.sprintSessionId },
      });
      if (!sprint) throw new NotFoundException('Sprint not found');
    }

    const submission = this.submissionRepo.create({
      user,
      problem,
      code: cmd.code,
      language: cmd.language,
      sprintSession: sprint || null,
    });

    await this.submissionRepo.save(submission);
    return SubmissionDto.toDto(submission);
  }

  async listSubmissionsByProblem(
    problemId: string,
    userId?: string,
  ): Promise<SubmissionDto[]> {
    const submissions = await this.submissionRepo.find({
      where: {
        problem: { uuid: problemId },
        ...(userId && { user: { uuid: userId } }),
      },
      relations: ['user', 'problem', 'sprintSession'],
    });
    return submissions.map(SubmissionDto.toDto);
  }
}
