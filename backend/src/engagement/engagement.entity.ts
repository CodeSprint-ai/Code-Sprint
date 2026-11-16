import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('engagement_requests')
export class EngagementRequest {
  @PrimaryGeneratedColumn('uuid') uuid: string;
  @Column({ type: 'varchar', length: 16 }) kind: 'contact' | 'waitlist';
  @Column({ type: 'varchar', length: 254 }) email: string;
  @Column({ type: 'varchar', length: 100, nullable: true }) name?: string;
  @Column({ type: 'varchar', length: 32, nullable: true }) category?: string;
  @Column({ type: 'text', nullable: true }) message?: string;
  @Column({ type: 'varchar', length: 16, nullable: true }) plan?:
    | 'monthly'
    | 'annual';
  @Column({ type: 'varchar', length: 32, default: 'beta-v1' })
  consentVersion: string;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
