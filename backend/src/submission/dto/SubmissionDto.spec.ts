import { SubmissionDto } from './SubmissionDto';
import { Submission } from '../entities/Submission';
import { filterHiddenResults } from '../../common/utils/filter-hidden-results';

describe('Submission result privacy', () => {
  const hidden = { isHidden: true, input: { secret: 42 }, expected: 42, got: 'secret output', verdict: 'ACCEPTED' };
  const visible = { isHidden: false, input: { x: 1 }, expected: 1, got: 1, verdict: 'ACCEPTED' };

  it('redacts REST results without modifying stored results', () => {
    const submission = { user: { uuid: 'user' }, problem: { uuid: 'problem' }, testResults: [hidden, visible] } as Submission;
    expect(SubmissionDto.toDto(submission).testResults).toEqual([
      { ...hidden, input: {}, expected: null, got: null }, visible,
    ]);
    expect(submission.testResults[0].input).toEqual({ secret: 42 });
  });

  it('applies the same redaction for socket results', () => {
    expect(filterHiddenResults([hidden])[0]).toEqual({ ...hidden, input: {}, expected: null, got: null });
  });

  it('handles submissions without results', () => {
    expect(SubmissionDto.toDto({ user: { uuid: 'u' }, problem: { uuid: 'p' } } as Submission).testResults).toBeUndefined();
  });
});
