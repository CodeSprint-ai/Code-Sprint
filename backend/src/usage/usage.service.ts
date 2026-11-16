import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { randomUUID } from 'crypto';

export const FREE_AI_LIMITS = { hint: 20, analysis: 3 } as const;
export type UsageKind = keyof typeof FREE_AI_LIMITS;

@Injectable()
export class UsageService {
  constructor(private readonly db: DataSource) {}

  private period() {
    return new Date().toISOString().slice(0, 7);
  }

  private async reserve(
    manager: EntityManager,
    userUuid: string,
    kind: UsageKind,
    resource: string,
  ) {
    const period = this.period();
    // Serialize per-user/month reservations across API instances and workers.
    await manager.query(
      'SELECT pg_advisory_xact_lock(hashtextextended($1, 0))',
      [`ai:${userUuid}:${kind}:${period}`],
    );
    const existing = await manager.query(
      'SELECT id FROM ai_usage_ledger WHERE user_uuid=$1 AND kind=$2 AND period=$3 AND resource=$4',
      [userUuid, kind, period, resource],
    );
    if (existing[0]) return existing[0].id as string;
    const [{ count }] = await manager.query(
      'SELECT COUNT(*)::int AS count FROM ai_usage_ledger WHERE user_uuid=$1 AND kind=$2 AND period=$3',
      [userUuid, kind, period],
    );
    if (Number(count) >= FREE_AI_LIMITS[kind]) {
      throw new HttpException(
        {
          message: `Your Free Beta ${kind === 'hint' ? 'hint' : 'analysis'} allowance is used up for this month. Practice remains available.`,
          code: 'AI_QUOTA_EXCEEDED',
          ...this.resetInfo(),
          limit: FREE_AI_LIMITS[kind],
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    const id = randomUUID();
    await manager.query(
      "INSERT INTO ai_usage_ledger (id, user_uuid, kind, period, resource, status) VALUES ($1,$2,$3,$4,$5,'reserved')",
      [id, userUuid, kind, period, resource],
    );
    return id;
  }

  async revealHint<T>(
    userUuid: string,
    operation: (manager: EntityManager) => Promise<T>,
  ): Promise<T> {
    return this.db.transaction(async (manager) => {
      const id = await this.reserve(manager, userUuid, 'hint', randomUUID());
      const result = await operation(manager);
      await manager.query(
        "UPDATE ai_usage_ledger SET status='completed' WHERE id=$1",
        [id],
      );
      return result;
    });
  }

  reserveAnalysis(userUuid: string, submissionUuid: string): Promise<string> {
    return this.db.transaction((manager) =>
      this.reserve(manager, userUuid, 'analysis', submissionUuid),
    );
  }
  async complete(id?: string) {
    if (id)
      await this.db.query(
        "UPDATE ai_usage_ledger SET status='completed' WHERE id=$1",
        [id],
      );
  }
  async release(id?: string) {
    if (id)
      await this.db.query(
        "DELETE FROM ai_usage_ledger WHERE id=$1 AND status='reserved'",
        [id],
      );
  }
  private resetInfo() {
    const now = new Date();
    return {
      resetsAt: new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
      ).toISOString(),
    };
  }
  async getUsage(userUuid: string) {
    const rows: { kind: UsageKind; completed: number; reserved: number }[] =
      await this.db.query(
        "SELECT kind, COUNT(*) FILTER (WHERE status='completed')::int AS completed, COUNT(*) FILTER (WHERE status='reserved')::int AS reserved FROM ai_usage_ledger WHERE user_uuid=$1 AND period=$2 GROUP BY kind",
        [userUuid, this.period()],
      );
    const allowance = (kind: UsageKind) => {
      const row = rows.find((entry) => entry.kind === kind);
      const used = row?.completed ?? 0;
      const reserved = row?.reserved ?? 0;
      return {
        limit: FREE_AI_LIMITS[kind],
        used,
        reserved,
        remaining: Math.max(0, FREE_AI_LIMITS[kind] - used - reserved),
      };
    };
    return {
      plan: 'free-beta',
      billingEnabled: false,
      ...this.resetInfo(),
      hints: allowance('hint'),
      analyses: allowance('analysis'),
    };
  }
}
