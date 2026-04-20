import { IsBoolean } from 'class-validator';

export class HintFeedbackDto {
    @IsBoolean()
    isUseful: boolean;
}
