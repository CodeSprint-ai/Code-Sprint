import { IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ThemePreference, DefaultLanguage } from '../entities/UserPreferences';

export class UpdatePreferencesCommand {
    @ApiPropertyOptional({ enum: ThemePreference })
    @IsOptional()
    @IsEnum(ThemePreference)
    theme?: ThemePreference;

    @ApiPropertyOptional({ enum: DefaultLanguage })
    @IsOptional()
    @IsEnum(DefaultLanguage)
    defaultLanguage?: DefaultLanguage;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    emailNotifications?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    marketingEmails?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    showActivityStatus?: boolean;
}
