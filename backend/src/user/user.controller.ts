import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.model';
import { AuthTokenDto } from '../auth/dto/auth.token.dto';
import { TokensDto } from '../auth/dto/token.dto';
import { UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Req() req): Promise<UserDto> {
    return UserDto.toDto(req.user);
  }
}
