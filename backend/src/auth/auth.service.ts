import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { RegisterCommand } from './command/register.command';
import { LoginCommand } from './command/login.command';
import { RefreshTokenCommand } from './command/refresh-token.command';
import { UserService } from 'src/user/user.service';
import { AuthTokenDto } from './dto/auth.token.dto';
import { JwtTokenService } from './jwt.service';
import { JwtService } from '@nestjs/jwt';
import { ClientSession, Connection } from 'mongoose';
import { MailService } from 'src/common/services/mail.service';
import * as bcrypt from 'bcrypt';
import { ValidationFailedException } from 'src/common/exceptions/ValidationFailedException';
import { Transactional } from 'src/common/decorators/TransactionalDecorator';
import { UserRepository } from 'src/user/user.repo';
import { AppLogger } from 'src/common/services/logger.service';
import { ProviderEnum } from './enum/ProviderEnum';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly userRepo: UserRepository,
        private readonly jwtService: JwtService,
        private readonly jwtTokenService: JwtTokenService,
        private readonly mailService: MailService,
        private readonly logger: AppLogger,
        @InjectConnection() private readonly connection: Connection
    ) { }

    @Transactional()
    async register(cmd: RegisterCommand, session?: ClientSession): Promise<{ message: string }> {
        this.logger.info(`Registering user with email: ${cmd.email}`, AuthService.name);

        const user = await this.userService.createLocalUser(cmd, session);

        const token = this.jwtService.sign(
            { userId: user._id },
            { secret: process.env.EMAIL_TOKEN_SECRET, expiresIn: '1h' },
        );

        await this.mailService.sendEmailVerification(user.email, token);

        this.logger.info(`Verification email sent to: ${user.email}`, AuthService.name);
        return { message: 'Verification email sent' };
    }

    async login(cmd: LoginCommand): Promise<AuthTokenDto> {
        this.logger.info(`Login attempt for: ${cmd.email}`, AuthService.name);

        const user = await this.userService.validateUser(cmd.email, cmd.password);
        const tokens = await this.jwtTokenService.generateTokens(user._id, user.email);
        const hashedRefresh = await this.jwtTokenService.hashRefreshToken(tokens.refreshToken);

        await this.userService.updateRefreshToken(user._id, hashedRefresh);

        this.logger.info(`Login successful for: ${cmd.email}`, AuthService.name);
        return AuthTokenDto.toDto(tokens, user);
    }

    async refreshTokens(cmd: RefreshTokenCommand): Promise<AuthTokenDto> {
        this.logger.debug(`Refreshing tokens for userId: ${cmd.userId}`, AuthService.name);

        const user = await this.userRepo.findById(cmd.userId);
        if (!user || !user.refreshToken) {
            this.logger.warn(`Refresh denied for userId: ${cmd.userId}`, AuthService.name);
            throw new ForbiddenException('Access Denied');
        }

        await this.jwtTokenService.validateRefreshToken(cmd.refreshToken, user.refreshToken);

        const tokens = await this.jwtTokenService.generateTokens(user._id, user.email);
        const hashedRefresh = await this.jwtTokenService.hashRefreshToken(tokens.refreshToken);

        await this.userService.updateRefreshToken(user._id, hashedRefresh);

        this.logger.info(`Refresh token success for userId: ${cmd.userId}`, AuthService.name);
        return AuthTokenDto.toDto(tokens, user);
    }

    async handleOAuthLogin(profile: { email: string; name: string; provider: ProviderEnum }) {
        this.logger.info(`OAuth login from ${profile.provider} for ${profile.email}`, AuthService.name);

        let user = await this.userRepo.findByEmail(profile.email);
        if (!user) {
            user = await this.userService.createOAuthUser(profile);
            this.logger.info(`OAuth user created: ${user.email}`, AuthService.name);
        }

        const tokens = await this.jwtTokenService.generateTokens(user._id, user.email);
        await this.userService.updateRefreshToken(user._id, tokens.refreshToken);

        return {
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                provider: user.provider,
            },
            ...tokens,
        };
    }

    async verifyEmail(token: string) {
        this.logger.debug(`Verifying email with token`, AuthService.name);

        try {
            const payload: any = this.jwtService.verify(token, {
                secret: process.env.EMAIL_TOKEN_SECRET,
            });

            const user = await this.userRepo.findById(payload.userId);
            if (!user) throw new ValidationFailedException('Invalid user', `user not found: ${payload.userId}`);

            user.isVerified = true;
            await user.save();

            this.logger.info(`Email verified for user: ${user.email}`, AuthService.name);
            return { message: 'Email verified successfully' };
        } catch (err) {
            this.logger.error('Email verification failed', err.message, AuthService.name);
            throw new BadRequestException('Invalid or expired token');
        }
    }

    @Transactional()
    async forgotPassword(email: string, session?: ClientSession) {
        this.logger.debug(`Initiating forgot password for: ${email}`, AuthService.name);

        const user = await this.userRepo.findByEmail(email);
        if (!user) throw new NotFoundException('No user found with this email');

        const token = this.jwtService.sign(
            { userId: user._id },
            { secret: process.env.RESET_TOKEN_SECRET, expiresIn: '15m' },
        );

        const passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
        await this.userRepo.update(user._id, {
            passwordResetToken: token,
            passwordResetExpires,
        }, session);

        await this.mailService.sendPasswordReset(user.email, token);

        this.logger.info(`Password reset link sent to: ${user.email}`, AuthService.name);
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
            this.logger.warn('Reset password failed due to invalid/expired token', AuthService.name);
            throw new ValidationFailedException('Invalid or expired token');
        }

        const user = await this.userRepo.findById(payload.userId);
        if (!user) throw new NotFoundException('User not found');

        if (
            !user.passwordResetToken ||
            user.passwordResetToken !== token ||
            !user.passwordResetExpires ||
            user.passwordResetExpires.getTime() < Date.now()
        ) {
            this.logger.warn('Token mismatch or expired during password reset', AuthService.name);
            throw new ValidationFailedException('Invalid or expired token');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save();

        this.logger.info(`Password reset successful for: ${user.email}`, AuthService.name);
        return { message: 'Password reset successfully' };
    }
}
