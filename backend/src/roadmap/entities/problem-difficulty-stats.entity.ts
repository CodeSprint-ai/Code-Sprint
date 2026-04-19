import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('problem_difficulty_stats')
export class ProblemDifficultyStats {
    @PrimaryColumn({ name: 'problem_id', type: 'uuid' })
    problemId: string;

    @Column({ name: 'difficulty', type: 'varchar', length: 10 })
    difficulty: string;

    @PrimaryColumn({ name: 'topic_name', type: 'varchar', length: 80 })
    topicName: string;

    @Column({ name: 'median_time_ms', type: 'int', default: 0 })
    medianTimeMs: number;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'NOW()' })
    updatedAt: Date;
}
