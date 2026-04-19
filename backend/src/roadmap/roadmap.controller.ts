import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoadmapService } from './roadmap.service';

@Controller('roadmap')
export class RoadmapController {
    constructor(private readonly roadmapService: RoadmapService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get(':userUuid')
    async getRoadmap(@Param('userUuid') userUuid: string) {
        return this.roadmapService.getRoadmapForUser(userUuid);
    }
}
