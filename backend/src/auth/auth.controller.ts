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
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterCommand) {
    const result = await this.authService.register(body);
    return ResponseWrapper.success(result, 'Verification email sent');
  }

  @Post('login')
  async login(
    @Body() body: LoginCommand,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body, res);
    return ResponseWrapper.success(result, 'Login successful');
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.refreshTokens(req, res);
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
    // res.cookie('accessToken', result.accessToken, {
    //   httpOnly: false,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: 15 * 60 * 1000, // 15 min
    // });

    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/', // or "/api/auth/refresh" if you want it scoped
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Get original redirect (fallback = dashboard)
    const redirectUrl = req.query.redirect || '/dashboard';

    return res.redirect(
      `http://localhost:3000/?oauth=true&redirect=${redirectUrl}`,
    );
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
    // res.cookie('accessToken', result.accessToken, {
    //   httpOnly: false,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'strict',
    //   maxAge: 15 * 60 * 1000, // 15 min
    // });

    res.cookie('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/', // or "/api/auth/refresh" if you want it scoped
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // ✅ Redirect frontend – no tokens in URL
    // Get original redirect (fallback = dashboard)
    const redirectUrl = req.query.redirect || '/dashboard';

    return res.redirect(
      `http://localhost:3000/?oauth=true&redirect=${redirectUrl}`,
    );
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
