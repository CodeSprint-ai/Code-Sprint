import {
    Body,
    Controller,
    Get,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterCommand } from './command/register.command';
import { LoginCommand } from './command/login.command';
import { RefreshTokenCommand } from './command/refresh-token.command';
import { ForgotPasswordCommand } from './command/forgotPassword.command';
import { ResetPasswordCommand } from './command/resetPassword.command';
import { AuthGuard } from '@nestjs/passport';
import { ResponseWrapper } from 'src/common/dtos/ResponseWrapper';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() body: RegisterCommand) {
        const result = await this.authService.register(body);
        return ResponseWrapper.success(result, 'Verification email sent');
    }

    @Post('login')
    async login(@Body() body: LoginCommand) {
        const result = await this.authService.login(body);
        return ResponseWrapper.success(result, 'Login successful');
    }

    @Post('refresh')
    async refresh(@Body() body: RefreshTokenCommand) {
        const result = await this.authService.refreshTokens(body);
        return ResponseWrapper.success(result, 'Tokens refreshed');
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
        return ResponseWrapper.success(null, 'Redirecting to Google...');
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleCallback(@Req() req) {
        const result = await this.authService.handleOAuthLogin(req.user);
        return ResponseWrapper.success(result, 'Google login successful');
    }

    @Get('github')
    @UseGuards(AuthGuard('github'))
    async githubAuth() {
        return ResponseWrapper.success(null, 'Redirecting to GitHub...');
    }

    @Get('github/callback')
    @UseGuards(AuthGuard('github'))
    async githubCallback(@Req() req) {
        const result = await this.authService.handleOAuthLogin(req.user);
        return ResponseWrapper.success(result, 'GitHub login successful');
    }

    @Post('verify-email')
    async verifyEmail(@Query('token') token: string) {
        const result = await this.authService.verifyEmail(token);
        return ResponseWrapper.success(result, 'Email verified');
    }

    @Post('forgot-password')
    async forgotPassword(@Body() command: ForgotPasswordCommand) {
        const result = await this.authService.forgotPassword(command.email);
        return ResponseWrapper.success(result, 'Reset link sent');
    }

    @Patch('reset-password')
    async resetPassword(@Body() command: ResetPasswordCommand) {
        const result = await this.authService.resetPassword(
            command.token,
            command.newPassword,
        );
        return ResponseWrapper.success(result, 'Password reset successfully');
    }
}
