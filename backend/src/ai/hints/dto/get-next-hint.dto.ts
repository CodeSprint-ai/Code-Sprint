import { IsUUID, IsOptional, IsString } from 'class-validator';

export class GetNextHintDto {
    @IsUUID()
    problemUuid: string;

    @IsOptional()
    @IsString()
    language?: string; // defaults to 'python' in the service
}
