import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterCommand } from './command/register.command';
import { LoginCommand } from './command/login.command';
import { UserService } from 'src/user/user.service';
import { AuthTokenDto } from './dto/auth.token.dto';
import { JwtTokenService } from './jwt.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/common/services/mail.service';
import * as bcrypt from 'bcrypt';
import { ValidationFailedException } from 'src/common/exceptions/ValidationFailedException';
import { Transactional } from 'src/common/decorators/TransactionalDecorator';
import { AppLogger } from 'src/common/services/logger.service';
import { ProviderEnum } from './enum/ProviderEnum';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.model';
import { Response, Request } from 'express';
import { SessionService } from './session.service';
import { SecurityLogService } from './security-log.service';
import { AccountStatus } from '../user/enum/AccountStatus';

/**
 * Cookie options for refresh token.
 */
const REFRESH_TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * Enhanced AuthService with session management, security logging,
 * and account status validation.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly mailService: MailService,
    private readonly logger: AppLogger,
    private readonly dataSource: DataSource,
    private readonly sessionService: SessionService,
    private readonly securityLogService: SecurityLogService,
  ) { }

  /**
   * Register a new user with email/password.
   */
  @Transactional()
  async register(
    cmd: RegisterCommand,
    manager?: EntityManager,
  ): Promise<{ message: string }> {
    this.logger.info(
      `Registering user with email: ${cmd.email}`,
      AuthService.name,
    );

    const user = await this.userService.createLocalUser(cmd);

    const token = this.jwtService.sign(
      { userUuid: user.uuid },
      { secret: process.env.EMAIL_TOKEN_SECRET, expiresIn: '1h' },
    );

    await this.mailService.sendEmailVerification(user.email, token);

    this.logger.info(
      `Verification email sent to: ${user.email}`,
      AuthService.name,
    );
    return { message: 'Verification email sent' };
  }

  /**
   * Login with email and password.
   * Creates a new session and returns access token with session-specific refresh token in cookie.
   */
  async login(cmd: LoginCommand, req: Request, res: Response): Promise<AuthTokenDto> {
    this.logger.info(`Login attempt for: ${cmd.email}`, AuthService.name);

    // Validate user credentials
    const user = await this.userService.validateUser(cmd.email, cmd.password);

    // Check account status
    this.validateAccountStatus(user, req);

    // Create a new session
    const { session, refreshToken } = await this.sessionService.createSession(
      user.uuid,
      req,
    );

    // Generate access token
    const accessToken = await this.generateAccessToken(user);

    // Store session ID and refresh token in cookie
    this.setSessionCookie(res, session.uuid, refreshToken);

    // Log successful login
    await this.securityLogService.logLoginSuccess(user.uuid, session.uuid, req);

    this.logger.info(`Login successful for: ${cmd.email}`, AuthService.name);

    return AuthTokenDto.toDto({ accessToken }, user);
  }

  /**
   * Logout from current session.
   */
  async logout(req: Request, res: Response): Promise<{ message: string }> {
    this.logger.info(`Logout attempt`, AuthService.name);

    const sessionId = this.getSessionIdFromCookie(req);

    if (sessionId) {
      // Get session to find user
      const session = await this.sessionService.getSessionById(sessionId);
      if (session) {
        await this.sessionService.revokeSession(sessionId);
        await this.securityLogService.logLogout(session.userId, sessionId, req);
      }
    }

    // Clear session cookie
    this.clearSessionCookie(res);

    this.logger.info(`Logout successful`, AuthService.name);

    return { message: 'Logged out successfully' };
  }

  /**
   * Logout from all devices/sessions.
   */
  async logoutAll(userId: string, req: Request, res: Response): Promise<{ message: string; sessionsRevoked: number }> {
    this.logger.info(`Logout all attempt for user: ${userId}`, AuthService.name);

    const count = await this.sessionService.revokeAllSessions(userId);

    // Log the event
    await this.securityLogService.logLogoutAll(userId, count, req);

    // Clear current session cookie
    this.clearSessionCookie(res);

    this.logger.info(`Logout all successful: ${count} sessions revoked`, AuthService.name);

    return { message: 'Logged out from all devices', sessionsRevoked: count };
  }

  /**
   * Refresh access token using session-specific refresh token.
   * Implements token rotation for enhanced security.
   */
  async refreshTokens(req: Request, res: Response): Promise<AuthTokenDto> {
    const { sessionId, refreshToken } = this.getSessionDataFromCookie(req);

    if (!sessionId || !refreshToken) {
      this.clearSessionCookie(res);
      throw new ForbiddenException('No valid session found');
    }

    // Validate session and refresh token
    const session = await this.sessionService.validateSession(sessionId, refreshToken);

    if (!session) {
      this.clearSessionCookie(res);
      throw new ForbiddenException('Invalid or expired session');
    }

    // Get user
    const user = await this.userRepository.findOneBy({ uuid: session.userId });
    if (!user) {
      this.clearSessionCookie(res);
      throw new ForbiddenException('User not found');
    }

    // Check account status
    try {
      this.validateAccountStatus(user, req);
    } catch (error) {
      this.clearSessionCookie(res);
      await this.sessionService.revokeSession(sessionId);
      throw error;
    }

    // Rotate refresh token
    const rotated = await this.sessionService.rotateRefreshToken(sessionId);
    if (!rotated) {
      this.clearSessionCookie(res);
      throw new ForbiddenException('Failed to refresh session');
    }

    // Generate new access token
    const accessToken = await this.generateAccessToken(user);

    // Update cookie with new refresh token
    this.setSessionCookie(res, sessionId, rotated.refreshToken);

    return AuthTokenDto.toDto({ accessToken }, user);
  }

  /**
   * Handle OAuth login/signup.
   * Creates or links OAuth account and creates a session.
   */
  async handleOAuthLogin(
    profile: {
      email: string;
      name: string;
      provider: ProviderEnum;
      providerId?: string;
    },
    req: Request,
  ): Promise<{ tokens: AuthTokenDto; refreshToken: string; sessionId: string; isNewUser: boolean }> {
    this.logger.info(
      `OAuth login from ${profile.provider} for ${profile.email}`,
      AuthService.name,
    );

    let isNewUser = false;
    let user = await this.userRepository.findOneBy({ email: profile.email });

    if (!user) {
      user = await this.userService.createOAuthUser(profile);
      isNewUser = true;
      this.logger.info(`OAuth user created: ${user.email}`, AuthService.name);
    }

    // Check account status
    this.validateAccountStatus(user, req);

    // Create session
    const { session, refreshToken } = await this.sessionService.createSession(
      user.uuid,
      req,
    );

    // Generate access token
    const accessToken = await this.generateAccessToken(user);

    // Log OAuth login
    await this.securityLogService.logOAuthLogin(
      user.uuid,
      session.uuid,
      profile.provider,
      req,
      isNewUser,
    );

    const tokens = AuthTokenDto.toDto({ accessToken }, user);

    return { tokens, refreshToken, sessionId: session.uuid, isNewUser };
  }

  /**
   * Verify email address.
   */
  async verifyEmail(token: string) {
    this.logger.debug(`Verifying email with token`, AuthService.name);

    try {
      const payload: any = this.jwtService.verify(token, {
        secret: process.env.EMAIL_TOKEN_SECRET,
      });

      const user = await this.userRepository.findOneBy({
        uuid: payload.userUuid,
      });
      if (!user)
        throw new ValidationFailedException(
          'Invalid user',
          `user not found: ${payload.userUuid}`,
        );

      // Update user verification status
      user.isVerified = true;
      user.status = AccountStatus.ACTIVE;
      await this.userRepository.update(user.uuid, {
        isVerified: true,
        status: AccountStatus.ACTIVE,
      });

      this.logger.info(
        `Email verified for user: ${user.email}`,
        AuthService.name,
      );
      return { message: 'Email verified successfully' };
    } catch (err) {
      this.logger.error(
        'Email verification failed',
        err.message,
        AuthService.name,
      );
      throw new BadRequestException('Invalid or expired token');
    }
  }

  /**
   * Resend verification email.
   */
  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    this.logger.debug(`Resending verification email to: ${email}`, AuthService.name);

    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      // Don't reveal if email exists for security
      return { message: 'If the email exists and is unverified, a verification link will be sent' };
    }

    if (user.isVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Generate new verification token
    const token = this.jwtService.sign(
      { userUuid: user.uuid },
      { secret: process.env.EMAIL_TOKEN_SECRET, expiresIn: '1h' },
    );

    await this.mailService.sendEmailVerification(user.email, token);

    this.logger.info(
      `Verification email resent to: ${user.email}`,
      AuthService.name,
    );

    return { message: 'Verification email sent' };
  }

  /**
   * Initiate password reset flow.
   */
  @Transactional()
  async forgotPassword(email: string, req: Request, manager?: EntityManager) {
    this.logger.debug(
      `Initiating forgot password for: ${email}`,
      AuthService.name,
    );

    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      // Don't reveal if email exists
      await this.securityLogService.logPasswordResetRequest(email, req);
      return { message: 'If the email exists, a reset link will be sent' };
    }

    const token = this.jwtService.sign(
      { userUuid: user.uuid },
      { secret: process.env.RESET_TOKEN_SECRET, expiresIn: '15m' },
    );

    const passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await this.userRepository.update(user.uuid, {
      passwordResetToken: token,
      passwordResetExpires,
    });

    await this.mailService.sendPasswordReset(user.email, token);
    await this.securityLogService.logPasswordResetRequest(email, req);

    this.logger.info(
      `Password reset link sent to: ${user.email}`,
      AuthService.name,
    );
    return { message: 'If the email exists, a reset link will be sent' };
  }

  /**
   * Reset password using token.
   * Invalidates all existing sessions for security.
   */
  async resetPassword(token: string, newPassword: string, req?: Request) {
    this.logger.debug(`Resetting password with token`, AuthService.name);

    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.RESET_TOKEN_SECRET,
      });
    } catch {
      this.logger.warn(
        'Reset password failed due to invalid/expired token',
        AuthService.name,
      );
      throw new ValidationFailedException('Invalid or expired token');
    }

    const user = await this.userRepository.findOneBy({
      uuid: payload.userUuid,
    });
    if (!user) throw new NotFoundException('User not found');

    if (
      !user.passwordResetToken ||
      user.passwordResetToken !== token ||
      !user.passwordResetExpires ||
      user.passwordResetExpires.getTime() < Date.now()
    ) {
      this.logger.warn(
        'Token mismatch or expired during password reset',
        AuthService.name,
      );
      throw new ValidationFailedException('Invalid or expired token');
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await this.userRepository.update(user.uuid, {
      password: user.password,
      passwordResetToken: null,
      passwordResetExpires: null,
    });

    // Revoke all sessions for security
    const revokedCount = await this.sessionService.revokeAllSessions(user.uuid);
    this.logger.info(
      `Revoked ${revokedCount} sessions after password reset for user: ${user.uuid}`,
      AuthService.name,
    );

    // Log the event
    await this.securityLogService.logPasswordResetSuccess(user.uuid, req);

    this.logger.info(
      `Password reset successful for: ${user.email}`,
      AuthService.name,
    );
    return { message: 'Password reset successfully' };
  }

  /**
   * Change password for authenticated user.
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    req: Request,
    revokeOtherSessions: boolean = true,
  ): Promise<{ message: string; sessionsRevoked?: number }> {
    const user = await this.userRepository.findOneBy({ uuid: userId });
    if (!user) throw new NotFoundException('User not found');

    // Verify current password
    if (user.password) {
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }
    }

    // Validate new password
    if (newPassword.length < 6) {
      throw new ValidationFailedException('Password must be at least 6 characters');
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, { password: hashedPassword });

    // Optionally revoke other sessions
    let sessionsRevoked = 0;
    if (revokeOtherSessions) {
      const currentSessionId = this.getSessionIdFromCookie(req);
      sessionsRevoked = await this.sessionService.revokeAllSessions(userId, currentSessionId ?? undefined);
    }

    // Log the event
    await this.securityLogService.logPasswordChange(userId, req);

    return {
      message: 'Password changed successfully',
      sessionsRevoked: revokeOtherSessions ? sessionsRevoked : undefined,
    };
  }

  /**
   * Add password to OAuth-only account.
   */
  async addPassword(
    userId: string,
    newPassword: string,
    req?: Request,
  ): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ uuid: userId });
    if (!user) throw new NotFoundException('User not found');

    if (user.password) {
      throw new BadRequestException('Account already has a password');
    }

    if (newPassword.length < 6) {
      throw new ValidationFailedException('Password must be at least 6 characters');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, { password: hashedPassword });

    this.logger.info(`Password added to OAuth account: ${user.uuid}`, AuthService.name);

    return { message: 'Password added successfully' };
  }

  /**
   * Get current user info.
   */
  async getCurrentUser(userId: string): Promise<AuthTokenDto> {
    const user = await this.userRepository.findOneBy({ uuid: userId });
    if (!user) throw new NotFoundException('User not found');

    const accessToken = await this.generateAccessToken(user);
    return AuthTokenDto.toDto({ accessToken }, user);
  }

  /**
   * Validate account status and throw appropriate errors.
   */
  private validateAccountStatus(user: User, req: Request): void {
    switch (user.status) {
      case AccountStatus.UNVERIFIED:
        if (!user.isVerified) {
          this.securityLogService.logLoginFailed(user.email, req, 'Email not verified');
          throw new ForbiddenException('Please verify your email before logging in');
        }
        break;

      case AccountStatus.SUSPENDED:
        this.securityLogService.logLoginFailed(user.email, req, 'Account suspended');
        throw new ForbiddenException('Your account has been suspended. Please contact support.');

      case AccountStatus.DELETED:
        this.securityLogService.logLoginFailed(user.email, req, 'Account deleted');
        throw new ForbiddenException('This account has been deleted.');
    }
  }

  /**
   * Generate access token for user.
   */
  private async generateAccessToken(user: User): Promise<string> {
    const tokens = await this.jwtTokenService.generateTokens(
      user.uuid,
      user.email,
      user.role,
    );
    return tokens.accessToken;
  }

  /**
   * Set session cookie with session ID and refresh token.
   */
  private setSessionCookie(res: Response, sessionId: string, refreshToken: string): void {
    // Store both session ID and refresh token in cookie
    const cookieValue = `${sessionId}:${refreshToken}`;
    res.cookie('refresh_token', cookieValue, REFRESH_TOKEN_COOKIE_OPTIONS);
  }

  /**
   * Clear session cookie.
   */
  private clearSessionCookie(res: Response): void {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });
  }

  /**
   * Get session ID from cookie.
   */
  private getSessionIdFromCookie(req: Request): string | null {
    const cookie = req.cookies['refresh_token'];
    if (!cookie) return null;
    const [sessionId] = cookie.split(':');
    return sessionId || null;
  }

  /**
   * Get session data (ID and refresh token) from cookie.
   */
  private getSessionDataFromCookie(req: Request): { sessionId: string | null; refreshToken: string | null } {
    const cookie = req.cookies['refresh_token'];
    if (!cookie) return { sessionId: null, refreshToken: null };

    const parts = cookie.split(':');
    if (parts.length < 2) return { sessionId: null, refreshToken: null };

    return {
      sessionId: parts[0],
      refreshToken: parts.slice(1).join(':'), // In case token contains ':'
    };
  }
}
