import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } fromimport { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { SubmissionCommand } from './command/SubmissionCommand';
import { SubmissionService } from './submission.service';
import { AuthGuard } from '@nestjs/passport';
import { GetSubmissionsQueryDto } from './dto/GetSubmissionsQueryDto';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Req() req, @Body() command: SubmissionCommand) {
    // req.user assumed set via auth middleware
    const user = req.user;
    const submission = await this.submissionService.createSubmission(command, user);
    return { submissionId: submission.uuid, status: submission.status };
  }

  // get submissions by problem UUID - must come before @Get() to avoid route conflicts
  @UseGuards(AuthGuard('jwt'))
  @Get('/problem/:uuid')
  async getByProblemUuid(@Param('uuid') uuid: string) {
    const submissions = await this.submissionService.getSubmissionsByProblemUuid(uuid);
    return submissions;
  }

  // get submissions by user UUID - must come before @Get() to avoid route conflicts
  @UseGuards(AuthGuard('jwt'))
  @Get('/problem/user/:uuid')
  async getByUserUuid(@Param('uuid') uuid: string) {
    const submissions = await this.submissionService.getSubmissionsByUserUuid(uuid);
    return submissions;
  }

  // Get paginated submissions with filters
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getSubmissions(
    @Query() query: GetSubmissionsQueryDto,
    @Req() req
  ) {
    const user = req.user;
    return await this.submissionService.getSubmissionsPaginated(query, user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':uuid')
  async getByUuid(@Param('uuid') uuid: string) {
    const submission = await this.submissionService.getSubmissionsByUuid(uuid);
    return submission;
  }
}
