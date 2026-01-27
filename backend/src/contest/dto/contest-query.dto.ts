import { IsOptional, IsString, IsEnum, IsInt, Min, Max, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export enum ContestTab {
    ONGOING = 'ongoing',
    UPCOMING = 'upcoming',
    NEXT_24H = 'next24h',
}

export enum ContestFormat {
    JSON = 'json',
    ATOM = 'atom',
    RSS = 'rss',
}

export class ContestQueryDto {
    @IsOptional()
    @IsEnum(ContestTab)
    tab?: ContestTab = ContestTab.UPCOMING;

    @IsOptional()
    @IsString()
    platforms?: string; // Comma-separated: "codeforces.com,leetcode.com"

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(200)
    limit?: number = 50;

    @IsOptional()
    @IsDateString()
    from?: string;

    @IsOptional()
    @IsDateString()
    to?: string;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(ContestFormat)
    format?: ContestFormat = ContestFormat.JSON;

    @IsOptional()
    @IsString()
    orderBy?: string = 'start';
}
