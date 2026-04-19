import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mastery_history')
export class MasteryHistory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_uuid', type: 'uuid' })
    userUuid: string;

    @Column({ name: 'topic_name', type: 'varchar', length: 80 })
    topicName: string;

    @Column({ name: 'mastery_score', type: 'decimal', precision: 5, scale: 2, default: 0 })
    masteryScore: number;

    @Column({ name: 'recorded_at', type: 'date' })
    recordedAt: Date;
}
