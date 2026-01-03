import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsNumber } from 'class-validator';

export class CreateSprintCommand {
    @IsUUID()
    @ApiProperty({ description: 'The UUID of the user starting the sprint' })
    userId: string;

    @IsOptional()
    @IsNumber()
    @ApiPropertyOptional({ description: 'Duration in minutes', default: 60 })
    durationMinutes?: number;
}
