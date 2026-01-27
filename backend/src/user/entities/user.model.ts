import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProviderEnum } from 'src/auth/enum/ProviderEnum';
import { RoleEnum } from 'src/user/enum/RoleEnum';
import { UserLevel } from '../enum/UserLevel';

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'uuid' })
  uuid: string;

  @Column({ name: 'username', type: 'varchar', length: 50, unique: true, nullable: true })
  username?: string;

  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'name', type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Column({ name: 'avatar_url', type: 'varchar', length: 500, nullable: true })
  avatarUrl?: string;

  @Column({ name: 'bio', type: 'text', nullable: true })
  bio?: string;

  @Column({ name: 'country', type: 'varchar', length: 100, nullable: true })
  country?: string;

  @Column({ name: 'social_links', type: 'jsonb', default: '{}' })
  socialLinks: SocialLinks;

  @Column({ name: 'password', type: 'varchar', length: 255, nullable: true })
  password?: string;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ name: 'email_verification_token', type: 'varchar', nullable: true })
  emailVerificationToken?: string;

  @Column({ name: 'password_reset_token', type: 'varchar', nullable: true })
  passwordResetToken?: string | null;

  @Column({ name: 'password_reset_expires', type: 'timestamptz', nullable: true })
  passwordResetExpires?: Date | null;

  @Column({ name: 'provider', type: 'enum', enum: ProviderEnum, default: ProviderEnum.LOCAL })
  provider: ProviderEnum;

  @Column({ name: 'refresh_token', type: 'varchar', nullable: true })
  refreshToken?: string | null;

  @Column({ name: 'role', type: 'enum', enum: RoleEnum, default: RoleEnum.USER })
  role: RoleEnum;

  @Column({ name: 'level', type: 'enum', enum: UserLevel, default: UserLevel.BEGINNER })
  level: UserLevel;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
