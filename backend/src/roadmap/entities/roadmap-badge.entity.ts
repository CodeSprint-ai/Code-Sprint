import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roadmap_badges')
export class RoadmapBadge {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_uuid', type: 'uuid' })
    userUuid: string;

    @Column({ name: 'badge_key', type: 'varchar', length: 80 })
    badgeKey: string;

    @Column({ name: 'badge_label', type: 'varchar', length: 120, nullable: true })
    badgeLabel: string;

    @Column({ name: 'awarded_at', type: 'timestamp', default: () => 'NOW()' })
    awardedAt: Date;
}
