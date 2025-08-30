import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.model';
import { TestCase } from './TestCase';
import { DifficultyEnum } from '../enum/DifficultyEnum';

@Entity('problems')
export class Problem {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column('text')
  description: string;

  @Column('text', { nullable: true })
  inputFormat: string;

  @Column('text', { nullable: true })
  outputFormat: string;

  @Column('text', { nullable: true })
  constraints: string;

  @Column('text', { nullable: true })
  sampleInput: string;

  @Column('text', { nullable: true })
  sampleOutput: string;

  @Column({
    type: 'enum',
    enum: DifficultyEnum,
  })
  difficulty: DifficultyEnum;

  @Column('text', { array: true, default: '{}' })
  tags: string[];

  @Column('text', { nullable: true })
  createdBy: string;

  @OneToMany(() => TestCase, (testCase) => testCase.problem, { cascade: true })
  testCases: TestCase[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
