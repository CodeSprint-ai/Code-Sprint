import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Unique,
    Index,
} from 'typeorm';

@Entity('hint_usage')
@Unique(['userUuid', 'problemUuid'])
export class HintUsage {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ name: 'user_uuid', type: 'uuid' })
    userUuid: string;

    @Column({ name: 'problem_uuid', type: 'uuid' })
    problemUuid: string;

    @Index('idx_hint_usage_lookup')
    @Column({ name: 'level_reached', default: 0 })
    levelReached: number;

    @Column({ name: 'hints_used_at', type: 'jsonb', default: '[]' })
    hintsUsedAt: Array<{ level: number; timestamp: string }>;

    @Column({
        name: 'score_penalty',
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 0,
        transformer: {
            to: (value: number) => value,
            from: (value: string) => parseFloat(value),
        },
    })
    scorePenalty: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
