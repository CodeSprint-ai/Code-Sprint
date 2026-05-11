import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BadgeDto } from '../../profile/dto/BadgeDto';

/**
 * Response DTO returned after sprint submission/finish.
 * Contains all gamification data the frontend needs for celebration UI.
 */
export class SprintCompletionDto {
  @ApiProperty({ description: 'Points earned in this sprint' })
  pointsEarned: number;

  @ApiProperty({ description: 'User total points (rating) after this sprint' })
  totalPoints: number;

  @ApiPropertyOptional({ description: 'New level if level changed, null otherwise' })
  newLevel: string | null;

  @ApiProperty({ description: 'Newly awarded badges (empty if none)', type: [BadgeDto] })
  newBadges: BadgeDto[];

  @ApiProperty({ description: 'Updated streak count' })
  updatedStreak: number;

  @ApiProperty({ description: 'Correct answers in this sprint' })
  correctAnswers: number;

  @ApiProperty({ description: 'Total questions in this sprint' })
  totalQuestions: number;

  @ApiProperty({ description: 'Breakdown by difficulty' })
  difficultyBreakdown: { easy: number; medium: number; hard: number };

  @ApiProperty({ description: 'Sprint session UUID' })
  sprintId: string;
}
