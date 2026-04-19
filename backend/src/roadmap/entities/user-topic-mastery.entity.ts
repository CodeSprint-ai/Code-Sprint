import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('user_topic_mastery')
export class UserTopicMastery {
    @PrimaryColumn({ name: 'user_uuid', type: 'uuid' })
    userUuid: string;

    @PrimaryColumn({ name: 'topic_name', type: 'varchar', length: 80 })
    topicName: string;

    @Column({ name: 'problems_solved', type: 'int', default: 0 })
    problemsSolved: number;

    @Column({ name: 'total_attempts', type: 'int', default: 0 })
    totalAttempts: number;

    @Column({ name: 'first_attempt_success_rate', type: 'decimal', precision: 5, scale: 2, default: 0 })
    firstAttemptSuccessRate: number;

    @Column({ name: 'avg_accuracy', type: 'decimal', precision: 5, scale: 2, default: 0 })
    avgAccuracy: number;

    @Column({ name: 'avg_hint_penalty', type: 'decimal', precision: 5, scale: 2, default: 0 })
    avgHintPenalty: number;

    @Column({ name: 'time_efficiency_score', type: 'decimal', precision: 5, scale: 2, default: 0 })
    timeEfficiencyScore: number;

    @Column({ name: 'consistency_score', type: 'decimal', precision: 5, scale: 2, default: 0 })
    consistencyScore: number;

    @Column({ name: 'mastery_score', type: 'decimal', precision: 5, scale: 2, default: 0 })
    masteryScore: number;

    @Column({ name: 'last_practiced', type: 'timestamp', default: () => 'NOW()' })
    lastPracticed: Date;
}
