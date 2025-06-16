import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterCommand } from 'src/auth/command/register.command';
import { User, UserDocument } from './entities/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async findById(userId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }

    async findByEmail(email: string) {
        const user = await this.userModel.findOne({ email });
        return user;
    }

    async createLocalUser(command: RegisterCommand , session?: ClientSession): Promise<UserDocument> {
        const { email, password, name } = command;

        // Check if email already exists
        const existingUser = await this.userModel.findOne({ email });
        if (existingUser) {
            throw new BadRequestException('Email already registered');
        }

        // Validate password strength (optional)
        if (password.length < 6) {
            throw new BadRequestException('Password must be at least 6 characters long');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new this.userModel({
            email,
            name,
            password: hashedPassword,
            provider: 'local',
        });

        return user.save({session});
    }

    async validateUser(email: string, password: string) {
        const user = await this.userModel.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException();
        }
        return user;
    }

    async updateRefreshToken(userId: string, refreshToken: string) {
        await this.userModel.findByIdAndUpdate(userId, { refreshToken });
    }

    async upsertOAuthUser(oauthPayload: { email: string; name: string; provider: string }) {
        let user = await this.userModel.findOne({ email: oauthPayload.email });
        if (!user) {
            user = new this.userModel({ ...oauthPayload });
            await user.save();
        }
        return user;
    }

    async createOAuthUser(profile: { email: string; name: string; provider: string }) {
        const user = new this.userModel({
            email: profile.email,
            name: profile.name,
            provider: profile.provider,
        });
        return user.save();
    }

}
