//local.strategy.ts
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserEntity } from 'src/user/entities/user.entity';
import { comparePassword } from 'src/common/utils/bcrypt';
import { UserService } from 'src/user/user.service';
import { ApiProperty } from '@nestjs/swagger';
import { SignInUserDto } from 'src/user/dto/signin-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }
  @ApiProperty({
    description: 'The id of the user',
    example: 'c23885d2-96ac-4764-b455-5d4aecdebf85',
  })
  async validate(email: string, password: string): Promise<UserEntity> {
    try {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(email)) {
        throw new BadRequestException('Enter Valid Email');
      }

      const user: UserEntity = await this.userService.findUserByEmail(email);

      if (user == undefined || user.password == null)
        throw new UnauthorizedException('email or passoword is not correct');
      if (!user.email_verified)
        throw new UnauthorizedException('User is not verified');
      let isMatch = await comparePassword(password, user.password);
      if (!isMatch)
        throw new UnauthorizedException('email or passoword is not correct');
      delete user.password;
      return user;
    } catch (error) {
      throw error;
    }
  }
}
