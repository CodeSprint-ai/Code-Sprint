import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.model';
import { SprintStatus } from '../../submission/enum/SprintStatus';
import { SprintProblem } from './SprintProblem';

@Entity('sprint_sessions')
export class SprintSession {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @OneToMany(() => SprintProblem, (sp) => sp.sprintSession, { cascade: true })
  sprintProblems: SprintProblem[];

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column({ type: 'enum', enum: SprintStatus, default: SprintStatus.PENDING })
  status: SprintStatus;

  @Column({ default: 0 })
  score: number;

  @Column({ nullable: true })
  completedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
