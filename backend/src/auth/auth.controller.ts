import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  Res,
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
  constructor(private readonly authService: AuthService) {}

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
  async googleCallback(@Req() req, @Res() res: any) {
    const result = await this.authService.handleOAuthLogin(req.user);

    // ✅ Set tokens in HttpOnly cookies
    res.cookie('accessToken', result.accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ✅ Redirect frontend – no tokens in URL
    return res.redirect('http://localhost:3000/dashboard');
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    return ResponseWrapper.success(null, 'Redirecting to GitHub...');
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req, @Res() res: any) {
    const result = await this.authService.handleOAuthLogin(req.user);
    // ✅ Set tokens in HttpOnly cookies
    res.cookie('accessToken', result.accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 min
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ✅ Redirect frontend – no tokens in URL
    return res.redirect('http://localhost:3000/dashboard');
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
