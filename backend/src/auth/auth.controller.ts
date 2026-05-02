import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
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
import { ForgotPasswordCommand } from './command/forgotPassword.command';
import { ResetPasswordCommand } from './command/resetPassword.command';
import { AuthGuard } from '@nestjs/passport';
import { ResponseWrapper } from 'src/common/dtos/ResponseWrapper';
import { Request, Response } from 'express';
import { Public } from 'src/common/decorators/publicDecorator';
import { SessionService } from './session.service';
import { RateLimiterGuard, RateLimit } from './guards/rate-limiter.guard';
import { JwtAuthGuard } from './guard/jwt.guard';

/**
 * DTOs for new endpoints
 */
class ChangePasswordCommand {
  currentPassword: string;
  newPassword: string;
  revokeOtherSessions?: boolean;
}

class AddPasswordCommand {
  newPassword: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
  ) { }

  /**
   * Register a new user with email/password.
   */
  @Public()
  @Post('register')
  @UseGuards(RateLimiterGuard)
  // @RateLimit({ maxAttempts: 5, windowSeconds: 3600 }) // 5 signups per hour
  async register(@Body() body: RegisterCommand) {
    const result = await this.authService.register(body);
    return ResponseWrapper.success(result, 'Verification email sent');
  }

  /**
   * Login with email/password.
   */
  @Public()
  @Post('login')
  @UseGuards(RateLimiterGuard)
  // @RateLimit({ maxAttempts: 5, windowSeconds: 900 }) // 5 attempts per 15 min
  async login(
    @Body() body: LoginCommand,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body, req, res);
    return ResponseWrapper.success(result, 'Login successful');
  }

  /**
   * Refresh access token.
   */
  @Public()
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.refreshTokens(req, res);
    return ResponseWrapper.success(result, 'Tokens refreshed');
  }

  /**
   * Get current user info.
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@Req() req: any) {
    const result = await this.authService.getCurrentUser(req.user.uuid);
    return ResponseWrapper.success(result, 'User retrieved');
  }

  /**
   * Logout from current session.
   */
  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.logout(req, res);
    return ResponseWrapper.success(result, 'Logged out successfully');
  }

  /**
   * Logout from all devices/sessions.
   */
  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  async logoutAll(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.logoutAll(req.user.uuid, req, res);
    return ResponseWrapper.success(result, 'Logged out from all devices');
  }

  // ==================== SESSION MANAGEMENT ====================

  /**
   * Get all active sessions for current user.
   */
  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  async getSessions(@Req() req: any) {
    const sessions = await this.sessionService.getUserSessions(req.user.uuid);

    // Get current session ID from cookie
    const currentSessionCookie = req.cookies['refresh_token'];
    const currentSessionId = currentSessionCookie ? currentSessionCookie.split(':')[0] : null;

    // Map sessions to DTOs with isCurrent flag
    const sessionsDto = sessions.map(session => ({
      id: session.uuid,
      device: session.device,
      browser: session.browser,
      os: session.os,
      ipAddress: session.ipAddress,
      location: session.location,
      isCurrent: session.uuid === currentSessionId,
      createdAt: session.createdAt,
      lastActiveAt: session.lastActiveAt,
    }));

    return ResponseWrapper.success(sessionsDto, 'Sessions retrieved');
  }

  /**
   * Revoke a specific session.
   */
  @Delete('sessions/:id')
  @UseGuards(JwtAuthGuard)
  async revokeSession(
    @Param('id') sessionId: string,
    @Req() req: any,
  ) {
    // Verify the session belongs to the current user
    const session = await this.sessionService.getSessionById(sessionId);

    if (!session || session.userId !== req.user.uuid) {
      throw new NotFoundException('Session not found');
    }

    await this.sessionService.revokeSession(sessionId);
    return ResponseWrapper.success({ revoked: true }, 'Session revoked');
  }

  /**
   * Revoke all sessions except current.
   */
  @Post('sessions/revoke-all')
  @UseGuards(JwtAuthGuard)
  async revokeAllSessions(@Req() req: any) {
    const currentSessionCookie = req.cookies['refresh_token'];
    const currentSessionId = currentSessionCookie ? currentSessionCookie.split(':')[0] : null;

    const count = await this.sessionService.revokeAllSessions(req.user.uuid, currentSessionId);
    return ResponseWrapper.success({ sessionsRevoked: count }, 'All other sessions revoked');
  }

  // ==================== PASSWORD MANAGEMENT ====================

  /**
   * Change password for authenticated user.
   */
  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Body() body: ChangePasswordCommand,
    @Req() req: any,
  ) {
    const result = await this.authService.changePassword(
      req.user.uuid,
      body.currentPassword,
      body.newPassword,
      req,
      body.revokeOtherSessions ?? true,
    );
    return ResponseWrapper.success(result, 'Password changed successfully');
  }

  /**
   * Add password to OAuth-only account.
   */
  @Post('add-password')
  @UseGuards(JwtAuthGuard)
  async addPassword(
    @Body() body: AddPasswordCommand,
    @Req() req: any,
  ) {
    const result = await this.authService.addPassword(
      req.user.uuid,
      body.newPassword,
      req,
    );
    return ResponseWrapper.success(result, 'Password added successfully');
  }

  /**
   * Forgot password - request reset link.
   */
  @Public()
  @Post('forgot-password')
  @UseGuards(RateLimiterGuard)
  @RateLimit({ maxAttempts: 3, windowSeconds: 3600 }) // 3 requests per hour
  async forgotPassword(
    @Body() command: ForgotPasswordCommand,
    @Req() req: Request,
  ) {
    const result = await this.authService.forgotPassword(command.email, req);
    return ResponseWrapper.success(result, 'Reset link sent');
  }

  /**
   * Reset password with token.
   */
  @Public()
  @Patch('reset-password')
  async resetPassword(
    @Body() command: ResetPasswordCommand,
    @Req() req: Request,
  ) {
    const result = await this.authService.resetPassword(
      command.token,
      command.newPassword,
      req,
    );
    return ResponseWrapper.success(result, 'Password reset successfully');
  }

  /**
   * Verify email with token.
   */
  @Public()
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    const result = await this.authService.verifyEmail(token);
    return ResponseWrapper.success(result, 'Email verified');
  }

  /**
   * Resend verification email.
   */
  @Public()
  @Post('resend-verification')
  @UseGuards(RateLimiterGuard)
  @RateLimit({ maxAttempts: 3, windowSeconds: 3600 }) // 3 requests per hour
  async resendVerification(@Body() body: { email: string }) {
    const result = await this.authService.resendVerificationEmail(body.email);
    return ResponseWrapper.success(result, 'Verification email sent');
  }

  // ==================== OAUTH PROVIDERS ====================

  /**
   * Initiate Google OAuth login.
   */
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    return ResponseWrapper.success(null, 'Redirecting to Google...');
  }

  /**
   * Google OAuth callback.
   */
  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: Response) {
    const { refreshToken, sessionId } = await this.authService.handleOAuthLogin(
      req.user,
      req,
    );

    // Set session cookie
    const cookieValue = `${sessionId}:${refreshToken}`;
    res.cookie('refresh_token', cookieValue, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const redirectUrl = req.query.redirect || '/dashboard';
    return res.redirect(
      `http://localhost:3000/?oauth=true&redirect=${redirectUrl}`,
    );
  }

  /**
   * Initiate GitHub OAuth login.
   */
  @Public()
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    return ResponseWrapper.success(null, 'Redirecting to GitHub...');
  }

  /**
   * GitHub OAuth callback.
   */
  @Public()
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: any, @Res() res: Response) {
    const { refreshToken, sessionId } = await this.authService.handleOAuthLogin(
      req.user,
      req,
    );

    // Set session cookie
    const cookieValue = `${sessionId}:${refreshToken}`;
    res.cookie('refresh_token', cookieValue, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const redirectUrl = req.query.redirect || '/dashboard';
    return res.redirect(
      `http://localhost:3000/?oauth=true&redirect=${redirectUrl}`,
    );
  }
}
