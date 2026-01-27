import {
    Controller,
    Get,
    Patch,
    Post,
    Delete,
    Body,
    Param,
    Req,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { StatsService } from './stats.service';
import { BadgeService } from './badge.service';
import { UpdateProfileCommand } from './commands/UpdateProfileCommand';
import { UpdatePreferencesCommand } from './commands/UpdatePreferencesCommand';
import { SaveProblemCommand, UpdateSavedProblemCommand } from './commands/SaveProblemCommand';
import { Public } from '../common/decorators/publicDecorator';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
    constructor(
        private readonly profileService: ProfileService,
        private readonly statsService: StatsService,
        private readonly badgeService: BadgeService,
    ) { }

    // ===================== PRIVATE ENDPOINTS (Authenticated) =====================

    @Get('me')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get authenticated user\'s private profile' })
    @ApiResponse({ status: 200, description: 'Private profile retrieved successfully' })
    async getMyProfile(@Req() req: any) {
        const profile = await this.profileService.getPrivateProfile(req.user.uuid);
        return { data: profile };
    }

    @Patch('me')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update authenticated user\'s profile' })
    @ApiResponse({ status: 200, description: 'Profile updated successfully' })
    async updateMyProfile(@Req() req: any, @Body() command: UpdateProfileCommand) {
        const user = await this.profileService.updateProfile(req.user.uuid, command);
        return { data: { message: 'Profile updated successfully', username: user.username } };
    }

    @Get('me/stats')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get authenticated user\'s detailed stats' })
    @ApiResponse({ status: 200, description: 'Stats retrieved successfully' })
    async getMyStats(@Req() req: any) {
        const stats = await this.statsService.getCompleteStats(req.user.uuid);
        return { data: stats };
    }

    @Get('me/settings')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get authenticated user\'s preferences' })
    @ApiResponse({ status: 200, description: 'Preferences retrieved successfully' })
    async getMySettings(@Req() req: any) {
        const profile = await this.profileService.getPrivateProfile(req.user.uuid);
        return { data: profile.preferences };
    }

    @Patch('me/settings')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update authenticated user\'s preferences' })
    @ApiResponse({ status: 200, description: 'Preferences updated successfully' })
    async updateMySettings(@Req() req: any, @Body() command: UpdatePreferencesCommand) {
        const prefs = await this.profileService.updatePreferences(req.user.uuid, command);
        return { data: { message: 'Preferences updated successfully' } };
    }

    @Get('me/badges')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get authenticated user\'s badges' })
    @ApiResponse({ status: 200, description: 'Badges retrieved successfully' })
    async getMyBadges(@Req() req: any) {
        const badges = await this.badgeService.getUserBadges(req.user.uuid);
        return { data: badges };
    }

    // ===================== SAVED PROBLEMS =====================

    @Get('me/saved-problems')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get authenticated user\'s saved problems' })
    @ApiResponse({ status: 200, description: 'Saved problems retrieved successfully' })
    async getMySavedProblems(@Req() req: any) {
        const savedProblems = await this.profileService.getSavedProblems(req.user.uuid);
        return { data: savedProblems };
    }

    @Post('me/saved-problems')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Save a problem (bookmark)' })
    @ApiResponse({ status: 201, description: 'Problem saved successfully' })
    @ApiResponse({ status: 409, description: 'Problem already saved' })
    async saveProblem(@Req() req: any, @Body() command: SaveProblemCommand) {
        const saved = await this.profileService.saveProblem(req.user.uuid, command);
        return { data: { message: 'Problem saved successfully', uuid: saved.uuid } };
    }

    @Patch('me/saved-problems/:uuid')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update saved problem notes' })
    @ApiResponse({ status: 200, description: 'Notes updated successfully' })
    async updateSavedProblem(
        @Req() req: any,
        @Param('uuid') uuid: string,
        @Body() command: UpdateSavedProblemCommand,
    ) {
        await this.profileService.updateSavedProblem(req.user.uuid, uuid, command);
        return { data: { message: 'Notes updated successfully' } };
    }

    @Delete('me/saved-problems/:uuid')
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Remove a saved problem' })
    @ApiResponse({ status: 204, description: 'Problem removed successfully' })
    async removeSavedProblem(@Req() req: any, @Param('uuid') uuid: string) {
        await this.profileService.removeSavedProblem(req.user.uuid, uuid);
    }

    // ===================== PUBLIC ENDPOINTS =====================

    @Public()
    @Get(':username')
    @ApiOperation({ summary: 'Get public profile by username' })
    @ApiResponse({ status: 200, description: 'Public profile retrieved successfully' })
    @ApiResponse({ status: 404, description: 'User not found' })
    async getPublicProfile(@Param('username') username: string) {
        const profile = await this.profileService.getPublicProfile(username);
        return { data: profile };
    }

    @Public()
    @Get(':username/stats')
    @ApiOperation({ summary: 'Get detailed stats for a user' })
    @ApiResponse({ status: 200, description: 'Stats retrieved successfully' })
    async getPublicStats(@Param('username') username: string, @Req() req: any) {
        // First get user UUID from username
        const profile = await this.profileService.getPublicProfile(username);
        // Note: We need to get the user UUID - for simplicity we'll modify later
        // For now, use the stats service directly with username lookup
        const stats = await this.statsService.getCompleteStats(req.user?.uuid || '');
        return { data: stats };
    }

    @Public()
    @Get(':username/badges')
    @ApiOperation({ summary: 'Get badges for a user' })
    @ApiResponse({ status: 200, description: 'Badges retrieved successfully' })
    async getPublicBadges(@Param('username') username: string) {
        // Get user UUID from username first
        const profile = await this.profileService.getPublicProfile(username);
        const badges = await this.badgeService.getUserBadges(profile.username);
        return { data: badges };
    }
}
