import { User } from '../entities/user.model';
import { RoleEnum } from '../enum/RoleEnum';

export class UserDto {
  userUuid: string;
  email: string;
  name: string;
  role: RoleEnum;
  avatarUrl?: string;

  public static toDto(user: User): UserDto {
    return {
      userUuid: user.uuid,
      email: user.email,
      name: user.name || '',
      role: user.role,
      avatarUrl: user.avatarUrl,
    };
  }
}
