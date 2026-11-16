import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from '../auth/guard/role.guard';
import { ProblemController } from './problem.controller';

describe('Problem mutation authorization', () => {
  const guard = new RolesGuard(new Reflector());
  it.each(['create', 'createBulk', 'update', 'remove'] as const)('%s requires ADMIN', (method) => {
    const context = (role: string) => ({
      getHandler: () => ProblemController.prototype[method],
      getClass: () => ProblemController,
      switchToHttp: () => ({ getRequest: () => ({ user: { role } }) }),
    }) as unknown as ExecutionContext;
    expect(guard.canActivate(context('USER'))).toBe(false);
    expect(guard.canActivate(context('ADMIN'))).toBe(true);
  });
});
