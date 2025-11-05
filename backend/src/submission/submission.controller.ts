import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SubmissionCommand } from './command/SubmissionCommand';
import { SubmissionService } from './submission.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Req() req, @Body() command: SubmissionCommand) {
    // req.user assumed set via auth middleware
    const user = req.user;
    const submission = await this.submissionService.createSubmission(command, user);
    return { submissionId: submission.uuid, status: submission.status };
  }
}
