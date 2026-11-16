import { HttpException } from '@nestjs/common';
import { UsageService } from './usage.service';
import { DataSource } from 'typeorm';

describe('Free Beta AI allowance', () => {
  let query: jest.Mock;
  let usage: UsageService;
  beforeEach(() => {
    query = jest.fn();
    usage = new UsageService({
      query,
      transaction: (operation: (manager: unknown) => Promise<unknown>) =>
        operation({ query }),
    } as unknown as DataSource);
    jest.useFakeTimers().setSystemTime(new Date('2026-11-17T12:00:00Z'));
  });
  afterEach(() => jest.useRealTimers());

  it('rejects an exhausted allowance before performing work and exposes its reset', async () => {
    query
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ count: 20 }]);
    const generate = jest.fn();
    try {
      await usage.revealHint('user', generate);
      throw new Error('Expected quota rejection');
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect((error as HttpException).getStatus()).toBe(429);
      expect((error as HttpException).getResponse()).toEqual(
        expect.objectContaining({
          limit: 20,
          resetsAt: '2026-12-01T00:00:00.000Z',
        }),
      );
    }
    expect(generate).not.toHaveBeenCalled();
  });

  it('completes a delivered hint after its work succeeds', async () => {
    query
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ count: 19 }])
      .mockResolvedValue([]);
    await expect(
      usage.revealHint('user', async () => 'hint content'),
    ).resolves.toBe('hint content');
    expect(query).toHaveBeenLastCalledWith(
      "UPDATE ai_usage_ledger SET status='completed' WHERE id=$1",
      [expect.any(String)],
    );
  });

  it('does not mark a failed hint as completed', async () => {
    query
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ count: 0 }])
      .mockResolvedValue([]);
    await expect(
      usage.revealHint('user', async () => {
        throw new Error('provider unavailable');
      }),
    ).rejects.toThrow('provider unavailable');
    expect(query.mock.calls.some(([sql]) => sql.startsWith('UPDATE'))).toBe(
      false,
    );
  });

  it('reuses a reservation for the same analysis rather than charging retries', async () => {
    query
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([{ id: 'existing-reservation' }]);
    await expect(usage.reserveAnalysis('user', 'submission')).resolves.toBe(
      'existing-reservation',
    );
    expect(query).toHaveBeenCalledTimes(2);
  });

  it('subtracts pending work and reports completed work separately', async () => {
    query.mockResolvedValue([
      { kind: 'hint', completed: 5, reserved: 0 },
      { kind: 'analysis', completed: 1, reserved: 1 },
    ]);
    const result = await usage.getUsage('user');
    expect(result.hints).toEqual({
      limit: 20,
      used: 5,
      reserved: 0,
      remaining: 15,
    });
    expect(result.analyses).toEqual({
      limit: 3,
      used: 1,
      reserved: 1,
      remaining: 1,
    });
    expect(result.billingEnabled).toBe(false);
  });
});
