import { Exclude, Expose } from 'class-transformer';
import { OmitType } from '@nestjs/mapped-types';
import { UserEntity } from '../entities/user.entity';

@Exclude()
export class UserDto extends OmitType(UserEntity, ['password']) {
  @Expose()
  full_name: string;

  @Expose()
  email: string;

  @Expose()
  email_verified: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  message: string;
}
