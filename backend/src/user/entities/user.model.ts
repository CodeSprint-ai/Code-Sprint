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

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password?: string;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'varchar', nullable: true })
  emailVerificationToken?: string;

  @Column({ type: 'varchar', nullable: true })
  passwordResetToken?: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  passwordResetExpires?: Date | null;

  @Column({ type: 'enum', enum: ProviderEnum, default: ProviderEnum.LOCAL })
  provider: ProviderEnum;

  @Column({ type: 'varchar', nullable: true })
  refreshToken?: string | null;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.USER })
  role: RoleEnum;

  @Column({ type: 'enum', enum: UserLevel, default: UserLevel.BEGINNER })
  level: UserLevel;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
