import { Controller, Post, Param, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseWrapper } from '../common/dtos/ResponseWrapper';
import { CreateSprintCommand } from './command/CreateSprintCommand';
import { SprintDto } from './dto/SprintDto';

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
        type: SprintDto,
    })
    async finishSprint(@Param('id') id: string): Promise<ReturnType<typeof ResponseWrapper.success>> {
        const sprint = await this.sprintService.finishSprint(id);
        return ResponseWrapper.success(sprint, 'Sprint finished successfully');
    }
}
