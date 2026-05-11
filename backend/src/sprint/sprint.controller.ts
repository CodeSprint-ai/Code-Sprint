import { Controller, Post, Get, Param, UseGuards, Req, Body, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { ResponseWrapper } from '../common/dtos/ResponseWrapper';
import { CreateSprintCommand } from './command/CreateSprintCommand';
import { SprintDto } from './dto/SprintDto';
import { SprintCompletionDto } from './dto/SprintCompletionDto';
import { FinishSprintDto } from './dto/FinishSprintDto';

@ApiTags('sprint')
@Controller('sprint')
export class SprintController {
    constructor(private readonly sprintService: SprintService) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiBearerAuth()
    @ApiResponse({
        status: 201,
        description: 'The sprint has been successfully created.',
        type: SprintDto,
    })
    async createSprint(@Req() req): Promise<ReturnType<typeof ResponseWrapper.success>> {
        const command = new CreateSprintCommand();
        command.userId = req.user.uuid;
        const sprint = await this.sprintService.createSprint(command);
        return ResponseWrapper.success(sprint, 'Sprint created successfully');
    }

    @UseGuards(AuthGuard('jwt'))
    @Post(':id/finish')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiResponse({
        status: 200,
        description: 'The sprint has been successfully finished.',
        type: SprintCompletionDto,
    })
    async finishSprint(
        @Param('id') id: string,
        @Body() dto: FinishSprintDto,
        @Req() req,
    ): Promise<ReturnType<typeof ResponseWrapper.success>> {
        // userId extracted from JWT — never trusted from request body
        const result = await this.sprintService.finishSprint(id, req.user.uuid, dto);
        return ResponseWrapper.success(result, 'Sprint finished successfully');
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('recent')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of recent sprints (default 5)' })
    @ApiResponse({
        status: 200,
        description: 'Recent sprint history.',
        type: [SprintDto],
    })
    async getRecentSprints(
        @Req() req,
        @Query('limit') limit?: number,
    ): Promise<ReturnType<typeof ResponseWrapper.success>> {
        const sprints = await this.sprintService.getRecentSprints(req.user.uuid, limit || 5);
        return ResponseWrapper.success(sprints, 'Recent sprints retrieved');
    }
}
