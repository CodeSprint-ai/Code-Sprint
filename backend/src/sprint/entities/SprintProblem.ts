import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { SprintSession } from './SprintSession';
import { Problem } from '../../problem/entities/Problem';

@Entity('sprint_problems')
export class SprintProblem {
  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  uuid: string;

  @ManyToOne(() => SprintSession, (s) => s.sprintProblems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sprint_session_id' })
  sprintSession: SprintSession;

  @ManyToOne(() => Problem, { eager: true })
  @JoinColumn({ name: 'problem_id' })
  problem: Problem;

  @Column({ name: 'order', default: 0 })
  order: number; // problem order in sprint

  @Column({ name: 'max_score', default: 0 })
  maxScore: number; // optional scoring
}
