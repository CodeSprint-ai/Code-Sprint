import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.model';
import { Problem } from '../../problem/entities/Problem';
import { SprintSession } from '../../sprint/entities/SprintSession';
import { SubmissionStatus } from '../enum/SubmissionStatus';
import { AnalysisResult } from '../../ai/post-submission/schema/analysis.schema';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  uuid: string;

  @ManyToOne(() => User, { nullable: false, eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Problem, { nullable: false, eager: true })
  @JoinColumn({ name: 'problem_id' })
  problem: Problem;

  @ManyToOne(() => SprintSession, { nullable: true, eager: true })
  @JoinColumn({ name: 'sprint_session_id' })
  sprintSession: SprintSession;

  @Column({ name: 'code', type: 'text' })
  code: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.PENDING,
  })
  status: SubmissionStatus;

  @Column({ name: 'language', nullable: true })
  language: string;

  @Column({ name: 'execution_time', type: 'float', nullable: true })
  executionTime: number;

  @Column({ name: 'memory_usage', type: 'float', nullable: true })
  memoryUsage: number;

  @Column({ name: 'test_results', type: 'jsonb', nullable: true })
  testResults: any; // [{input, expected, got, verdict, runtime}]

  @Column({ name: 'judge_tokens', type: 'text', nullable: true })
  judgeTokens?: string; // JSON stringified array of tokens from Judge0

  @Column({ name: 'compile_output', type: 'text', nullable: true })
  compileOutput?: string; // optional aggregate compile output

  @Column({ name: 'ai_analysis', type: 'jsonb', nullable: true })
  aiAnalysis: AnalysisResult | null;

  @Column({ name: 'finished_at', nullable: true })
  finishedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
