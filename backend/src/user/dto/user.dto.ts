import { User } from "../entities/user.model";

export class UserDto {
  userUuid: string;
  email: string;
  name: string;

  public static toDto(user: User): UserDto {
    return {
      userUuid: user.uuid,
      email: user.email,
      name: user.name || "",
    };
  }

}