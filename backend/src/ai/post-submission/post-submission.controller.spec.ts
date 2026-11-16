import { ForbiddenException } from '@nestjs/common';
import { PostSubmissionController } from './post-submission.controller';

describe('Analysis quota dispatch', () => {
  let controller: PostSubmissionController;
  let queue: any;
  let repo: any;
  let quota: any;
  beforeEach(() => {
    queue = {
      add: jest.fn().mockResolvedValue({ id: 'analysis-reservation' }),
      getJob: jest.fn().mockResolvedValue(null),
    };
    repo = {
      findOne: jest
        .fn()
        .mockResolvedValue({ user: { uuid: 'owner' }, aiAnalysis: null }),
    };
    quota = {
      reserveAnalysis: jest.fn().mockResolvedValue('reservation'),
      release: jest.fn(),
    };
    controller = new PostSubmissionController(
      queue,
      repo,
      {} as any,
      {} as any,
      quota,
    );
  });
  it('checks ownership before reserving allowance', async () => {
    await expect(
      controller.triggerAnalysis('submission', { user: { uuid: 'other' } }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(quota.reserveAnalysis).not.toHaveBeenCalled();
  });
  it('returns a cached completed analysis without reserving or queuing', async () => {
    repo.findOne.mockResolvedValue({
      user: { uuid: 'owner' },
      aiAnalysis: { feedback: 'cached' },
    });
    expect(
      await controller.triggerAnalysis('submission', {
        user: { uuid: 'owner' },
      }),
    ).toEqual(expect.objectContaining({ status: 'cached' }));
    expect(quota.reserveAnalysis).not.toHaveBeenCalled();
  });
  it('passes one stable reservation/job id for retries', async () => {
    await controller.triggerAnalysis('submission', { user: { uuid: 'owner' } });
    expect(queue.add).toHaveBeenCalledWith(
      'analyze',
      {
        submissionId: 'submission',
        userId: 'owner',
        reservationId: 'reservation',
      },
      { jobId: 'analysis-reservation' },
    );
  });
  it('refunds an enqueue failure only when no job exists', async () => {
    queue.add.mockRejectedValue(new Error('queue unavailable'));
    await expect(
      controller.triggerAnalysis('submission', { user: { uuid: 'owner' } }),
    ).rejects.toThrow('queue unavailable');
    expect(quota.release).toHaveBeenCalledWith('reservation');
  });
  it('does not refund an ambiguous timeout when the job was actually queued', async () => {
    queue.add.mockRejectedValue(new Error('timeout'));
    queue.getJob.mockResolvedValue({ id: 'analysis-reservation' });
    await expect(
      controller.triggerAnalysis('submission', { user: { uuid: 'owner' } }),
    ).rejects.toThrow('timeout');
    expect(quota.release).not.toHaveBeenCalled();
  });
  it('does not expose another user analysis results through the polling endpoint', async () => {
    queue.getJob.mockResolvedValue({ data: { userId: 'other' } });
    await expect(
      controller.getJobStatus('job', { user: { uuid: 'owner' } }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
