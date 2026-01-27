import { Controller, Get, Query, Header } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ContestService } from './contest.service';
import { ContestQueryDto, ContestTab, ContestFormat } from './dto/contest-query.dto';
import { ContestsApiResponse } from './dto/contest-response.dto';
import { Public } from '../common/decorators/publicDecorator';

@ApiTags('contests')
@Controller('api/contests')
export class ContestController {
    constructor(private readonly contestService: ContestService) { }

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get programming contests from CLIST' })
    @ApiQuery({ name: 'tab', enum: ContestTab, required: false, description: 'Filter by contest status' })
    @ApiQuery({ name: 'platforms', required: false, description: 'Comma-separated platform filter (e.g., codeforces.com,leetcode.com)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Max results (1-200, default 50)' })
    @ApiQuery({ name: 'from', required: false, description: 'Start date filter (ISO 8601)' })
    @ApiQuery({ name: 'to', required: false, description: 'End date filter (ISO 8601)' })
    @ApiQuery({ name: 'search', required: false, description: 'Search in contest name' })
    @ApiQuery({ name: 'format', enum: ContestFormat, required: false, description: 'Response format (json, atom, rss)' })
    @ApiQuery({ name: 'orderBy', required: false, description: 'Sort field (start, duration, -start, -duration)' })
    @ApiResponse({ status: 200, description: 'List of contests' })
    @ApiResponse({ status: 429, description: 'Rate limit exceeded' })
    @ApiResponse({ status: 503, description: 'Contest data temporarily unavailable' })
    async getContests(@Query() query: ContestQueryDto): Promise<ContestsApiResponse | string> {
        const result = await this.contestService.getContests(query);

        // Handle RSS/Atom format passthrough
        if (query.format !== ContestFormat.JSON && (result as any).raw) {
            return (result as any).raw;
        }

        return result;
    }
}
