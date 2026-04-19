import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    Req,
    UseGuards,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { HintService } from './hint.service';
import { GetNextHintDto } from './dto/get-next-hint.dto';
import { HintFeedbackDto } from './dto/hint-feedback.dto';
import { Roles } from '../../common/decorators/roleDecorater';
import {
    RateLimiterGuard,
    RateLimit,
} from '../../auth/guards/rate-limiter.guard';

@Controller('hints')
export class HintController {
    constructor(
        private readonly hintService: HintService,
        @InjectQueue('hint-generation') private readonly hintQueue: Queue,
    ) { }

    /**
     * Get the next hint for a problem.
     * Rate limited: 10 requests per 60 seconds per user.
     */
    @Post('next')
    @UseGuards(AuthGuard('jwt'), RateLimiterGuard)
    @RateLimit({
        maxAttempts: 10,
        windowSeconds: 60,
        keyGenerator: (req: any) => `hints:${req.user?.uuid || req.ip}`,
    })
    @HttpCode(HttpStatus.OK)
    async getNextHint(@Body() dto: GetNextHintDto, @Req() req: any) {
        return this.hintService.getNextHint(
            req.user.uuid,
            dto.problemUuid,
            dto.language || 'python',
        );
    }

    /**
     * Get current hint usage state for a problem (for UI display).
     */
    @Get('usage/:problemUuid')
    @UseGuards(AuthGuard('jwt'))
    async getUsage(
        @Param('problemUuid') problemUuid: string,
        @Req() req: any,
    ) {
        return this.hintService.getUsage(req.user.uuid, problemUuid);
    }

    /**
     * Submit feedback on a specific hint (useful / not useful).
     */
    @Post(':hintUuid/feedback')
    @UseGuards(AuthGuard('jwt'))
    @HttpCode(HttpStatus.OK)
    async rateFeedback(
        @Param('hintUuid') hintUuid: string,
        @Body() dto: HintFeedbackDto,
    ) {
        return this.hintService.rateFeedback(hintUuid, dto.isUseful);
    }

    /**
     * Admin: Dispatch a background job to bulk-generate hints for a problem.
     */
    @Post('generate/:problemUuid')
    @UseGuards(AuthGuard('jwt'))
    @Roles('ADMIN')
    @HttpCode(HttpStatus.ACCEPTED)
    async generateHints(
        @Param('problemUuid') problemUuid: string,
        @Body('language') language?: string,
    ) {
        const job = await this.hintQueue.add('generate', {
            problemUuid,
            language: language || 'python',
        });

        return { jobId: job.id, status: 'queued' };
    }

    /**
     * Admin: Check generation job status.
     */
    @Get('job-status/:id')
    @UseGuards(AuthGuard('jwt'))
    @Roles('ADMIN')
    async getJobStatus(@Param('id') id: string) {
        const job = await this.hintQueue.getJob(id);
        if (!job) {
            return { status: 'not_found' };
        }

        const state = await job.getState();

        return {
            id: job.id,
            state,
            progress: job.progress(),
            result: job.returnvalue,
            error: job.failedReason,
        };
    }
}
