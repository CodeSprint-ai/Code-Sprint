import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn
} from "typeorm";
import { Problem } from "./Problem";

@Entity("test_cases")
export class TestCase {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @ManyToOne(() => Problem, (problem) => problem.testCases, { onDelete: "CASCADE" })
  problem: Problem;

  @Column("text")
  input: string;

  @Column("text")
  expectedOutput: string;

  @Column({ default: false })
  isSample: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
