import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';
import { CreateProblemCommand } from './ProblemCommand';

export class BulkCreateProblemCommand {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProblemCommand)
    @ApiProperty({
        type: [CreateProblemCommand],
        description: 'Array of problems to create',
    })
    problems: CreateProblemCommand[];
}
