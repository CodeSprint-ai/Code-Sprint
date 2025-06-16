import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { RegisterCommand } from './command/register.command';
import { LoginCommand } from './command/login.command';
import { RefreshTokenCommand } from './command/refresh-token.command';
import { UserService } from 'src/user/user.service';
import { AuthTokenDto } from './dto/auth.token.dto';
import { JwtTokenService } from './jwt.service';
import { JwtService } from '@nestjs/jwt';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/entities/user.model';
import { MailService } from 'src/common/mail.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtTokenService: JwtTokenService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
        @InjectConnection() private readonly connection: Connection,
        @InjectModel(User.name) private userModel: Model<User>,
    ) { }

    async register(cmd: RegisterCommand): Promise<{ message: string }> {
        const session = await this.connection.startSession();
        session.startTransaction();

        try {
            const user = await this.userService.createLocalUser(cmd, session);

            const token = this.jwtService.sign(
                { userId: user._id },
                {
                    secret: process.env.EMAIL_TOKEN_SECRET,
                    expiresIn: '1h',
                },
            );

            await this.mailService.sendEmailVerification(user.email, token);

            await session.commitTransaction();
            return { message: 'Verification email sent' };
        } catch (error) {
            await session.abortTransaction();
            throw new BadRequestException('Registration failed: ' + error.message);
        } finally {
            session.endSession();
        }
    }



    async login(cmd: LoginCommand): Promise<AuthTokenDto> {
        const user = await this.userService.validateUser(cmd.email, cmd.password);
        const tokens = await this.jwtTokenService.generateTokens(user._id.toString(), user.email);
        const hashedRefresh = await this.jwtTokenService.hashRefreshToken(tokens.refreshToken);
        await this.userService.updateRefreshToken(user._id.toString(), hashedRefresh);
        return AuthTokenDto.toDto(tokens, user);
    }

    async refreshTokens(cmd: RefreshTokenCommand): Promise<AuthTokenDto> {
        const user = await this.userService.findById(cmd.userId);
        if (!user || !user.refreshToken) throw new ForbiddenException('Access Denied');
        await this.jwtTokenService.validateRefreshToken(cmd.refreshToken, user.refreshToken);
        const tokens = await this.jwtTokenService.generateTokens(user._id.toString(), user.email);
        const hashedRefresh = await this.jwtTokenService.hashRefreshToken(tokens.refreshToken);
        await this.userService.updateRefreshToken(user._id.toString(), hashedRefresh);
        return AuthTokenDto.toDto(tokens, user);
    }


    async handleOAuthLogin(profile: { email: string; name: string; provider: string }) {
        let user = await this.userService.findByEmail(profile.email);

        if (!user) {
            user = await this.userService.createOAuthUser(profile);
        }

        const tokens = await this.jwtTokenService.generateTokens(user._id.toString(), user.email);
        await this.userService.updateRefreshToken(user._id.toString(), tokens.refreshToken);

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
        try {
            const payload: any = this.jwtService.verify(token, {
                secret: process.env.EMAIL_TOKEN_SECRET,
            });

            const user = await this.userModel.findById(payload.userId);
            if (!user) throw new BadRequestException('Invalid user');

            user.isVerified = true;
            await user.save();

            return { message: 'Email verified successfully' };
        } catch {
            throw new BadRequestException('Invalid or expired token');
        }
    }

    // todo make transactional this function also
    async forgotPassword(email: string) {
        const user = await this.userModel.findOne({ email });
        if (!user) throw new BadRequestException('No user found with this email');

        const token = this.jwtService.sign(
            { userId: user._id },
            { secret: process.env.RESET_TOKEN_SECRET, expiresIn: '15m' },
        );

        user.passwordResetToken = token;
        user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
        await user.save();

        await this.mailService.sendPasswordReset(user.email, token);

        return { message: 'Reset link sent to email' };
    }

    async resetPassword(token: string, newPassword: string) {
        let payload: any;
        try {
            payload = this.jwtService.verify(token, {
                secret: process.env.RESET_TOKEN_SECRET,
            });
        } catch {
            throw new BadRequestException('Invalid or expired token');
        }

        const user = await this.userModel.findById(payload.userId);
        if (!user) throw new BadRequestException('User not found');

        if (
            !user.passwordResetToken ||
            user.passwordResetToken !== token ||
            !user.passwordResetExpires ||
            user.passwordResetExpires.getTime() < Date.now()
        ) {
            throw new BadRequestException('Invalid or expired token');
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save();

        return { message: 'Password reset successfully' };
    }
}