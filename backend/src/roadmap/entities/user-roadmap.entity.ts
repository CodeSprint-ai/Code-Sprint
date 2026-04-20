import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('user_roadmaps')
export class UserRoadmap {
    @PrimaryColumn({ name: 'user_uuid', type: 'uuid' })
    userUuid: string;

    @Column({ name: 'roadmap_json', type: 'jsonb', nullable: true })
    roadmapJson: any;

    @Column({ name: 'needs_regen', type: 'boolean', default: true })
    needsRegen: boolean;

    @Column({ name: 'updated_at', type: 'timestamp', default: () => 'NOW()' })
    updatedAt: Date;
}
