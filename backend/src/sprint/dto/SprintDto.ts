import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SprintSession } from '../entities/SprintSession';
import { SprintStatus } from '../../submission/enum/SprintStatus';
import { ProblemDto } from '../../problem/dto/ProblemDto';

export class SprintProblemDto {
  @ApiProperty()
  order: number;

  @ApiProperty()
  maxScore: number;

  @ApiProperty({ type: () => ProblemDto, nullable: true })
  problem: ProblemDto | null;
}

export class SprintDto {
  @ApiProperty({ description: 'The UUID of the sprint session' })
  uuid: string;

  @ApiProperty({ description: 'The UUID of the user' })
  userId: string;

  @ApiProperty({ description: 'Start time of the sprint' })
  startTime: Date;

  @ApiProperty({ description: 'End time of the sprint' })
  endTime: Date;

  @ApiProperty({ enum: SprintStatus, description: 'Status of the sprint' })
  status: SprintStatus;

  @ApiProperty({ description: 'Total score achieved' })
  score: number;

  @ApiPropertyOptional({ description: 'Completion time' })
  completedAt?: Date;

  @ApiProperty({ type: [SprintProblemDto], description: 'Problems in the sprint' })
  sprintProblems: SprintProblemDto[];

  static toDto(sprint: SprintSession): SprintDto {
    return {
      uuid: sprint.uuid,
      userId: sprint.user.uuid,
      startTime: sprint.startTime,
      endTime: sprint.endTime,
      status: sprint.status,
      score: sprint.score,
      completedAt: sprint.completedAt,
      sprintProblems: sprint.sprintProblems?.sort((a, b) => a.order - b.order).map(sp => ({
        order: sp.order,
        maxScore: sp.maxScore,
        problem: sp.problem ? ProblemDto.toDto(sp.problem) : null,
      })) || [],
    };
  }
}
