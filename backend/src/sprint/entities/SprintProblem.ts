import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SprintSession } from './SprintSession';
import { Problem } from '../../problem/entities/Problem';

@Entity('sprint_problems')
export class SprintProblem {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => SprintSession, (s) => s.sprintProblems, { onDelete: 'CASCADE' })
  sprintSession: SprintSession;

  @ManyToOne(() => Problem, { eager: true })
  problem: Problem;

  @Column({ default: 0 })
  order: number; // problem order in sprint

  @Column({ default: 0 })
  maxScore: number; // optional scoring
}
