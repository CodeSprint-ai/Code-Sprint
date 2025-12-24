import { PartialType } from '@nestjs/swagger';
import { CreateProblemCommand } from './ProblemCommand';
import { IsUUID } from 'class-validator';

export class UpdateProblemCommand extends PartialType(CreateProblemCommand) {
  @IsUUID()
  problemUuid: string;
}