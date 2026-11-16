import { Reflector } from '@nestjs/core';
import { ProblemService } from './problem.service';
import { ProblemController } from './problem.controller';
import { IS_PUBLIC_KEY } from '../common/decorators/publicDecorator';

describe('Public problem catalogue', () => {
  it('projects only public fields and never joins test cases or users', async () => {
    const query: any = {};
    for (const method of [
      'select',
      'orderBy',
      'addOrderBy',
      'andWhere',
      'skip',
      'take',
    ])
      query[method] = jest.fn().mockReturnValue(query);
    query.getManyAndCount = jest
      .fn()
      .mockResolvedValue([[{ title: 'Two Sum' }], 1]);
    const service = new ProblemService(
      { createQueryBuilder: () => query } as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
    );
    const result = await service.getPublicCatalog({
      page: 1,
      pageSize: 12,
      search: 'Sum',
      difficulty: 'EASY',
    });
    expect(query.select).toHaveBeenCalledWith([
      'problem.uuid',
      'problem.title',
      'problem.slug',
      'problem.difficulty',
      'problem.tags',
      'problem.description',
    ]);
    expect(query.andWhere).toHaveBeenCalledWith('problem.title ILIKE :search', {
      search: '%Sum%',
    });
    expect(query.andWhere).toHaveBeenCalledWith(
      'problem.difficulty = :difficulty',
      { difficulty: 'EASY' },
    );
    expect(result.meta).toEqual({
      total: 1,
      page: 1,
      pageSize: 12,
      totalPages: 1,
    });
  });
  it('marks only the dedicated catalogue handler as public', () => {
    const reflector = new Reflector();
    expect(
      reflector.get(IS_PUBLIC_KEY, ProblemController.prototype.publicCatalog),
    ).toBe(true);
    expect(
      reflector.get(IS_PUBLIC_KEY, ProblemController.prototype.create),
    ).not.toBe(true);
  });
});
