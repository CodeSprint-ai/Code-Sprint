import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Unique,
} from 'typeorm';

@Entity('problem_hints')
@Unique(['problemUuid', 'level', 'language'])
export class ProblemHint {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ name: 'problem_uuid', type: 'uuid' })
    problemUuid: string;

    @Column()
    level: number;

    @Column({ type: 'text' })
    content: string;

    @Column({ default: 'python' })
    language: string;

    @Column({ default: 1 })
    version: number;

    @Column({ name: 'useful_count', default: 0 })
    usefulCount: number;

    @Column({ name: 'not_useful_count', default: 0 })
    notUsefulCount: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
