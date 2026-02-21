import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.model';
import { TestCase } from './TestCase';
import { DifficultyEnum } from '../enum/DifficultyEnum';
import { PatternEnum } from '../enum/PatternEnum';
import { StarterCode } from '../../judge/interfaces/starter-code.interface';
import { ExecutionConfig } from '../../judge/interfaces/execution-config.interface';

/**
 * Problem Entity
 *
 * ✅ Function-based, stdin/stdout, and class-design problems
 * ✅ Supports Java, Python, C++
 * ✅ executionConfig drives global runner templates
 * ❌ NO per-problem runner templates
 */
@Entity('problems')
export class Problem {
  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  uuid: string;

  @Column({ name: 'title', length: 255 })
  title: string;

  @Column({ name: 'slug', length: 255, unique: true })
  slug: string;

  @Column({ name: 'description', type: 'text' })
  description: string;

  @Column({ name: 'input_format', type: 'text', nullable: true })
  inputFormat: string;

  @Column({ name: 'output_format', type: 'text', nullable: true })
  outputFormat: string;

  @Column({ name: 'constraints', type: 'text', nullable: true })
  constraints: string;

  @Column({ name: 'sample_input', type: 'text', nullable: true })
  sampleInput: string;

  @Column({ name: 'sample_output', type: 'text', nullable: true })
  sampleOutput: string;

  @Column({
    name: 'difficulty',
    type: 'enum',
    enum: DifficultyEnum,
  })
  difficulty: DifficultyEnum;

  @Column({
    name: 'patterns',
    type: 'enum',
    enum: PatternEnum,
    array: true,
    default: '{}',
  })
  patterns: PatternEnum[];

  @Column({ name: 'tags', type: 'text', array: true, default: '{}' })
  tags: string[];

  @Column({ name: 'companies', type: 'text', array: true, default: '{}' })
  companies: string[];

  /**
   * Starter code - What the USER sees in the editor
   * Contains Solution class template for each language
   */
  @Column({ name: 'starter_code', type: 'jsonb', nullable: true, default: () => `'{"java":"","python":"","cpp":""}'` })
  starterCode: StarterCode;

  /**
   * Execution config - Drives the global runner templates
   * Defines how to execute, compare, and serialize output
   *
   * @example
   * {
   *   "type": "FUNCTION",
   *   "className": "Solution",
   *   "methodName": "twoSum",
   *   "compareMode": "EXACT",
   *   "outputSerializer": "NONE"
   * }
   */
  @Column({
    name: 'execution_config',
    type: 'jsonb',
    nullable: true,
    default: () => `'{"type":"FUNCTION","className":"Solution","methodName":"","compareMode":"EXACT","outputSerializer":"NONE"}'`,
  })
  executionConfig: ExecutionConfig;

  @Column({ name: 'time_limit_seconds', default: 2 })
  timeLimitSeconds: number;

  @Column({ name: 'memory_limit_mb', default: 256 })
  memoryLimitMB: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @OneToMany(() => TestCase, (testCase) => testCase.problem, { cascade: true, eager: true })
  testCases: TestCase[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
