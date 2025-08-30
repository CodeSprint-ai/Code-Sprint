import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from "../../user/entities/user.model"
import { SprintStatus } from '../../submission/enum/SprintStatus';

@Entity('sprint_sessions')
export class SprintSession {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @Column('text', { array: true })
  problemIds: string[]; // UUIDs of problems in this sprint

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column({ type: 'enum', enum: SprintStatus, default: SprintStatus.PENDING })
  status: SprintStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
