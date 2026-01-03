import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.model';
import { SprintStatus } from '../../submission/enum/SprintStatus';
import { SprintProblem } from './SprintProblem';

@Entity('sprint_sessions')
export class SprintSession {
  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  uuid: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => SprintProblem, (sp) => sp.sprintSession, { cascade: true })
  sprintProblems: SprintProblem[];

  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'end_time' })
  endTime: Date;

  @Column({ name: 'status', type: 'enum', enum: SprintStatus, default: SprintStatus.PENDING })
  status: SprintStatus;

  @Column({ name: 'score', default: 0 })
  score: number;

  @Column({ name: 'completed_at', nullable: true })
  completedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
