import { User, UserDocument } from "../entities/user.model";

export class UserDto {
  userId: string;
  email: string;
  name: string;

  public static toDto(user: UserDocument): UserDto {
    return {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
    };
  }

}