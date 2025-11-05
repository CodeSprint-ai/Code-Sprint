import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.model';
import { Problem } from '../../problem/entities/Problem';
import { SprintSession } from '../../sprint/entities/SprintSession';
import { SubmissionStatus } from '../enum/SubmissionStatus';


@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @ManyToOne(() => Problem, { nullable: false })
  problem: Problem;

  @ManyToOne(() => SprintSession, { nullable: true })
  sprintSession: SprintSession;

  @Column('text')
  code: string;

  @Column({
    type: 'enum',
    enum: SubmissionStatus,
    default: SubmissionStatus.PENDING,
  })
  status: SubmissionStatus;

  @Column({ nullable: true })
  language: string;

  @Column({ type: 'float', nullable: true })
  executionTime: number;

  @Column({ type: 'float', nullable: true })
  memoryUsage: number;

  @Column({ type: 'jsonb', nullable: true })
  testResults: any; // [{input, expected, got, verdict, runtime}]

  @CreateDateColumn()
  createdAt: Date;
}
