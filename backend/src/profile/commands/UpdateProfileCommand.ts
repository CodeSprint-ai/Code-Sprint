import { IsString, IsOptional, MaxLength, IsUrl, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SocialLinksCommand {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(100)
    github?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(100)
    linkedin?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(100)
    twitter?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUrl()
    website?: string;
}

export class UpdateProfileCommand {
    @ApiPropertyOptional({ maxLength: 50 })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    username?: string;

    @ApiPropertyOptional({ maxLength: 255 })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;

    @ApiPropertyOptional({ maxLength: 500 })
    @IsOptional()
    @IsUrl()
    avatarUrl?: string;

    @ApiPropertyOptional({ maxLength: 500 })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    bio?: string;

    @ApiPropertyOptional({ maxLength: 100 })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    country?: string;

    @ApiPropertyOptional({ type: SocialLinksCommand })
    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => SocialLinksCommand)
    socialLinks?: SocialLinksCommand;
}
