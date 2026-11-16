import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { EngagementRequest } from './engagement.entity';
import { ContactDto, WaitlistDto } from './engagement.dto';
import { MailService } from '../common/services/mail.service';

@Injectable()
export class EngagementService {
  private readonly logger = new Logger(EngagementService.name);
  constructor(
    @InjectRepository(EngagementRequest)
    private readonly repo: Repository<EngagementRequest>,
    private readonly mail: MailService,
    private readonly config: ConfigService,
  ) {}

  async joinWaitlist(dto: WaitlistDto) {
    // A partial unique index makes concurrent duplicate joins idempotent.
    const result = await this.repo
      .createQueryBuilder()
      .insert()
      .into(EngagementRequest)
      .values({
        kind: 'waitlist',
        email: dto.email,
        plan: dto.plan,
        consentVersion: 'beta-v1',
      })
      .orIgnore()
      .returning('uuid')
      .execute();
    if (result.raw.length)
      this.notify('New Pro waitlist signup', result.raw[0].uuid);
    return {
      message:
        'Your interest has been recorded. We will email you when Pro is available. No payment has been taken.',
    };
  }

  async contact(dto: ContactDto) {
    const request = await this.repo.save(
      this.repo.create({
        kind: 'contact',
        email: dto.email,
        name: dto.name,
        category: dto.category,
        message: dto.message,
        consentVersion: 'beta-v1',
      }),
    );
    this.notify('New CodeSprint contact request', request.uuid);
    return {
      reference: request.uuid,
      message:
        'Your message has been received. Keep this reference for follow-up.',
    };
  }

  private notify(subject: string, reference: string) {
    if (!this.config.get('RESEND_API_KEY')) return;
    // Send only a reference, not personal details or submitted code, in notifications.
    void this.mail
      .sendEmail({
        to: this.config.get('SUPPORT_EMAIL') || 'codesprint.ai@gmail.com',
        subject,
        html: `<p>A request is available in the admin inbox.</p><p>Reference: ${reference}</p>`,
      })
      .catch(() =>
        this.logger.warn(
          `Support notification failed for reference ${reference}; request remains saved.`,
        ),
      );
  }

  async remove(uuid: string) {
    await this.repo.delete(uuid);
    return { removed: true };
  }

  list() {
    return this.repo.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  @Cron('0 3 * * *', { timeZone: 'UTC' })
  async removeExpiredRequests() {
    await this.repo.manager.query(
      "DELETE FROM ai_usage_ledger WHERE created_at < NOW() - INTERVAL '90 days'",
    );
    await this.repo
      .createQueryBuilder()
      .delete()
      .where(
        "(kind = 'contact' AND created_at < NOW() - INTERVAL '90 days') OR (kind = 'waitlist' AND created_at < NOW() - INTERVAL '365 days')",
      )
      .execute();
  }
}
