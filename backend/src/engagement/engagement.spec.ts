import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Reflector } from '@nestjs/core';
import { EngagementController } from './engagement.controller';
import { ContactDto, WaitlistDto } from './engagement.dto';
import { IS_PUBLIC_KEY } from '../common/decorators/publicDecorator';
import { ROLES_KEY } from '../common/decorators/roleDecorater';

const waitlist = {
  email: '  STUDENT@example.com ',
  plan: 'annual',
  consent: true,
  website: '',
};
describe('Public contact and waitlist boundaries', () => {
  it('normalizes valid email and requires actual boolean consent', async () => {
    const dto = plainToInstance(WaitlistDto, waitlist);
    expect(dto.email).toBe('student@example.com');
    expect(await validate(dto)).toHaveLength(0);
    for (const consent of [false, 'true', 'false', undefined]) {
      expect(
        (
          await validate(plainToInstance(WaitlistDto, { ...waitlist, consent }))
        ).some((error) => error.property === 'consent'),
      ).toBe(true);
    }
  });
  it('rejects invalid plan, invalid email, and bot-filled honeypots', async () => {
    const errors = await validate(
      plainToInstance(WaitlistDto, {
        ...waitlist,
        email: 'invalid',
        plan: 'unlimited',
        website: 'spam',
      }),
    );
    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining(['email', 'plan', 'website']),
    );
  });
  it('requires a bounded message and supported category for contact', async () => {
    const valid = {
      name: 'Student',
      email: 'student@example.com',
      category: 'support',
      message: 'I need help with my account.',
      consent: true,
    };
    expect(await validate(plainToInstance(ContactDto, valid))).toHaveLength(0);
    expect(
      await validate(
        plainToInstance(ContactDto, { ...valid, message: 'x'.repeat(5001) }),
      ),
    ).not.toHaveLength(0);
  });
  it('keeps inbox reads/deletions private and restricted to admins', () => {
    const reflector = new Reflector();
    for (const method of ['inbox', 'remove'] as const) {
      const handler = EngagementController.prototype[method];
      expect(reflector.get(IS_PUBLIC_KEY, handler)).not.toBe(true);
      expect(reflector.get(ROLES_KEY, handler)).toEqual(['ADMIN']);
    }
    expect(
      reflector.get(IS_PUBLIC_KEY, EngagementController.prototype.contact),
    ).toBe(true);
    expect(
      reflector.get(IS_PUBLIC_KEY, EngagementController.prototype.waitlist),
    ).toBe(true);
  });
});
