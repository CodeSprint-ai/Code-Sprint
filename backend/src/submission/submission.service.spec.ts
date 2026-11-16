import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { SubmissionService } from './submission.service';
import { RoleEnum } from '../user/enum/RoleEnum';

const owner = { uuid: 'owner', role: RoleEnum.USER };
const admin = { uuid: 'admin', role: RoleEnum.ADMIN };

describe('Submission read authorization', () => {
  let service: SubmissionService;
  let repo: any;
  let qb: any;

  beforeEach(() => {
    qb = {};
    for (const method of ['leftJoinAndSelect', 'orderBy', 'andWhere', 'skip', 'take']) {
      qb[method] = jest.fn().mockReturnValue(qb);
    }
    qb.getCount = jest.fn().mockResolvedValue(0);
    qb.getMany = jest.fn().mockResolvedValue([]);
    repo = {
      findOne: jest.fn().mockResolvedValue(null),
      find: jest.fn().mockResolvedValue([]),
      createQueryBuilder: jest.fn().mockReturnValue(qb),
    };
    service = new SubmissionService(repo, {} as any, {} as any);
  });

  it('scopes individual reads and hides inaccessible IDs', async () => {
    await expect(service.getSubmissionsByUuid('submission', owner)).rejects.toBeInstanceOf(NotFoundException);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { uuid: 'submission', user: { uuid: 'owner' } } });
  });

  it('scopes problem history to the authenticated user', async () => {
    await service.getSubmissionsByProblemUuid('problem', owner);
    expect(repo.find).toHaveBeenCalledWith(expect.objectContaining({ where: { problem: { uuid: 'problem' }, user: { uuid: 'owner' } } }));
  });

  it('rejects another user history before querying', async () => {
    await expect(service.getSubmissionsByUserUuid('other', owner)).rejects.toBeInstanceOf(ForbiddenException);
    expect(repo.find).not.toHaveBeenCalled();
  });

  it('rejects a foreign pagination filter', async () => {
    await expect(service.getSubmissionsPaginated({ userId: 'other' }, owner)).rejects.toBeInstanceOf(ForbiddenException);
    expect(qb.getMany).not.toHaveBeenCalled();
  });

  it.each([{}, { userId: 'owner' }])('restricts ordinary paginated reads: %j', async (query) => {
    await service.getSubmissionsPaginated(query, owner);
    expect(qb.andWhere).toHaveBeenCalledWith('user.uuid = :userId', { userId: 'owner' });
  });

  it('allows admins to filter another user', async () => {
    await service.getSubmissionsPaginated({ userId: 'other' }, admin);
    expect(qb.andWhere).toHaveBeenCalledWith('user.uuid = :userId', { userId: 'other' });
    await service.getSubmissionsByUserUuid('other', admin);
    expect(repo.find).toHaveBeenCalledWith(expect.objectContaining({ where: { user: { uuid: 'other' } } }));
  });

  it('allows admin histories without restricting to their account', async () => {
    await service.getSubmissionsByProblemUuid('problem', admin);
    expect(repo.find).toHaveBeenCalledWith(expect.objectContaining({ where: { problem: { uuid: 'problem' } } }));
    await service.getSubmissionsPaginated({}, admin);
    expect(qb.andWhere).not.toHaveBeenCalled();
  });
});
