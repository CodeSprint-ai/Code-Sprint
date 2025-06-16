import { Body, Controller, Get, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { RegisterCommand } from './command/register.command';
import { LoginCommand } from './command/login.command';
import { RefreshTokenCommand } from './command/refresh-token.command';
import { AuthTokenDto } from './dto/auth.token.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ForgotPasswordCommand } from './command/forgotPassword.command';
import { ResetPasswordCommand } from './command/resetPassword.command';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }
    @Post('register')
    async register(@Body() body: RegisterCommand): Promise<{ message: string }> {
        return this.authService.register(body);
    }

    @Post('login')
    async login(@Body() body: LoginCommand): Promise<AuthTokenDto> {
        return this.authService.login(body);
    }

    @Post('refresh')
    async refresh(@Body() body: RefreshTokenCommand): Promise<AuthTokenDto> {
        return this.authService.refreshTokens(body);
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() { }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleCallback(@Req() req) {
        return this.authService.handleOAuthLogin(req.user);
    }

    @Get('github')
    @UseGuards(AuthGuard('github'))
    async githubAuth() { }

    @Get('github/callback')
    @UseGuards(AuthGuard('github'))
    async githubCallback(@Req() req) {
        return this.authService.handleOAuthLogin(req.user);
    }

    @Post('verify-email')
    async verifyEmail(@Query('token') token: string) {
        return this.authService.verifyEmail(token);
    }

    @Post('forgot-password')
    async forgotPassword(@Body() command: ForgotPasswordCommand) {
        return this.authService.forgotPassword(command.email);
    }

    @Patch('reset-password')
    async resetPassword(@Body() command: ResetPasswordCommand) {
        return this.authService.resetPassword(command.token, command.newPassword);
    }
}
