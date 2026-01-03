import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Problem } from './Problem';

/**
 * TestCase Entity
 * 
 * ✅ JSON input format (language-agnostic)
 * ✅ JSON expected output
 * ❌ No raw stdin strings
 */
@Entity('test_cases')
export class TestCase {
  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  uuid: string;

  @ManyToOne(() => Problem, (problem) => problem.testCases, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'problem_id' })
  problem: Problem;

  @Column({ name: 'input', type: 'jsonb', nullable: true, default: () => `'{}'` })
  input: Record<string, unknown>;


  @Column({ name: 'input_text', type: 'text', nullable: true })
  inputText: string;


  @Column({ name: 'expected_output', type: 'jsonb', nullable: true })
  expectedOutput: unknown;


  @Column({ name: 'expected_output_text', type: 'text', nullable: true })
  expectedOutputText: string;

  @Column({ name: 'is_sample', default: false })
  isSample: boolean;

  @Column({ name: 'is_hidden', default: false })
  isHidden: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  getInput(): Record<string, unknown> {
    if (this.input && Object.keys(this.input).length > 0) {
      return this.input;
    }
    if (this.inputText) {
      try {
        return JSON.parse(this.inputText);
      } catch {
        // If not JSON, wrap as stdin
        return { stdin: this.inputText };
      }
    }
    return {};
  }

  getExpectedOutput(): unknown {
    if (this.expectedOutput !== null && this.expectedOutput !== undefined) {
      return this.expectedOutput;
    }
    if (this.expectedOutputText) {
      try {
        return JSON.parse(this.expectedOutputText);
      } catch {
        return this.expectedOutputText;
      }
    }
    return null;
  }
}
