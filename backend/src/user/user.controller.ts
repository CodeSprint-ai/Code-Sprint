import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.model';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getMe(@Req() req): Promise<Omit<User, 'password'>> {
        const { password, ...result } = req.user;
        return result;
    }
}