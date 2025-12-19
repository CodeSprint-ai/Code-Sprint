import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterCommand } from './command/register.command';
import { LoginCommand } from './command/login.command';
import { RefreshTokenCommand } from './command/refresh-token.command';
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
  ) { }

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

  // async login(cmd: LoginCommand): Promise<AuthTokenDto> {
  //   this.logger.info(`Login attempt for: ${cmd.email}`, AuthService.name);

  //   const user = await this.userService.validateUser(cmd.email, cmd.password);
  //   const tokens = await this.jwtTokenService.generateTokens(
  //     user.uuid,
  //     user.email,
  //   );
  //   const hashedRefresh = await this.jwtTokenService.hashRefreshToken(
  //     tokens.refreshToken,
  //   );

  //   await this.userService.updateRefreshToken(user.uuid, hashedRefresh);

  //   this.logger.info(`Login successful for: ${cmd.email}`, AuthService.name);
  //   return AuthTokenDto.toDto(tokens, user);
  // }

  async login(cmd: LoginCommand, res: Response): Promise<AuthTokenDto> {
    this.logger.info(`Login attempt for: ${cmd.email}`, AuthService.name);

    const user = await this.userService.validateUser(cmd.email, cmd.password);
    console.log({ user });

    const tokens = await this.jwtTokenService.generateTokens(
      user.uuid,
      user.email,
      user.role
    );

    console.log({ tokens });

    // Store refresh token in cookie (HttpOnly, Secure, SameSite=Strict)
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/', // or "/api/auth/refresh" if you want it scoped
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    this.logger.info(`Login successful for: ${cmd.email}`, AuthService.name);

    // Only return access token + user
    return AuthTokenDto.toDto({ accessToken: tokens.accessToken }, user);
  }
  
  async logout(res: Response): Promise<{ message: string }> {
    this.logger.info(`Logout attempt`, AuthService.name);

    // Clear refresh token cookie
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/', // must match login cookie path
    });

    this.logger.info(`Logout successful`, AuthService.name);

    return { message: 'Logged out successfully' };
  }

  // async refreshTokens(cmd: RefreshTokenCommand): Promise<AuthTokenDto> {
  //   this.logger.debug(
  //     `Refreshing tokens for userUuid: ${cmd.userUuid}`,
  //     AuthService.name,
  //   );

  //   const user = await this.userRepository.findOneBy({ uuid: cmd.userUuid });
  //   if (!user || !user.refreshToken) {
  //     this.logger.warn(
  //       `Refresh denied for userUuid: ${cmd.userUuid}`,
  //       AuthService.name,
  //     );
  //     throw new ForbiddenException('Access Denied');
  //   }

  //   await this.jwtTokenService.validateRefreshToken(
  //     cmd.refreshToken,
  //     user.refreshToken,
  //   );

  //   const tokens = await this.jwtTokenService.generateTokens(
  //     user.uuid,
  //     user.email,
  //   );
  //   const hashedRefresh = await this.jwtTokenService.hashRefreshToken(
  //     tokens.refreshToken,
  //   );

  //   await this.userService.updateRefreshToken(user.uuid, hashedRefresh);

  //   this.logger.info(
  //     `Refresh token success for userUuid: ${cmd.userUuid}`,
  //     AuthService.name,
  //   );
  //   return AuthTokenDto.toDto(tokens, user);
  // }

  async refreshTokens(req: Request, res: Response): Promise<AuthTokenDto> {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) throw new ForbiddenException('No refresh token found');

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.userRepository.findOneBy({ uuid: payload.sub });
      if (!user) throw new ForbiddenException('User not found');

      const tokens = await this.jwtTokenService.generateTokens(
        user.uuid,
        user.email,
        user.role
      );

      // update cookie
      res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/', // or "/api/auth/refresh" if you want it scoped
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return AuthTokenDto.toDto({ accessToken: tokens.accessToken }, user);
    } catch (e) {
      throw new ForbiddenException('Invalid or expired refresh token');
    }
  }

  async handleOAuthLogin(profile: {
    email: string;
    name: string;
    provider: ProviderEnum;
  }): Promise<AuthTokenDto> {
    this.logger.info(
      `OAuth login from ${profile.provider} for ${profile.email}`,
      AuthService.name,
    );

    let user = await this.userRepository.findOneBy({ email: profile.email });
    if (!user) {
      user = await this.userService.createOAuthUser(profile);
      this.logger.info(`OAuth user created: ${user.email}`, AuthService.name);
    }

    const tokens = await this.jwtTokenService.generateTokens(
      user.uuid,
      user.email,
      user.role
    );

    if (tokens.refreshToken)
      await this.userService.updateRefreshToken(user.uuid, tokens.refreshToken);

    return AuthTokenDto.toDto(tokens, user);
  }

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

      user.isVerified = true;
      await this.userRepository.update(user.uuid, user);

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

  @Transactional()
  async forgotPassword(email: string, manager?: EntityManager) {
    this.logger.debug(
      `Initiating forgot password for: ${email}`,
      AuthService.name,
    );

    const user = await this.userRepository.findOneBy({ email });
    if (!user) throw new NotFoundException('No user found with this email');

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

    this.logger.info(
      `Password reset link sent to: ${user.email}`,
      AuthService.name,
    );
    return { message: 'Reset link sent to email' };
  }

  async resetPassword(token: string, newPassword: string) {
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

    user.password = await bcrypt.hash(newPassword, 10);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await this.userRepository.update(user.uuid, user);

    this.logger.info(
      `Password reset successful for: ${user.email}`,
      AuthService.name,
    );
    return { message: 'Password reset successfully' };
  }
}
