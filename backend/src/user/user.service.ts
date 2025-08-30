import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterCommand } from 'src/auth/command/register.command';
import { ClientSession, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { ValidationFailedException } from 'src/common/exceptions/ValidationFailedException';
import { UserRepository } from './user.repo';
import { RequestContextService } from 'src/common/services/request-context.service';
import { AppLogger } from 'src/common/services/logger.service';
import { ProviderEnum } from 'src/auth/enum/ProviderEnum';
import { User } from './entities/user.model';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly context: RequestContextService,
    private readonly logger: AppLogger,
  ) {}

  async createLocalUser(
    command: RegisterCommand
  ): Promise<User> {
    const { email, password, name } = command;

    this.logger.info(`Creating local user: ${email}`, UserService.name);

    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      this.logger.warn(`Email already exists: ${email}`, UserService.name);
      throw new ValidationFailedException('Email already registered');
    }

    if (password.length < 6) {
      this.logger.warn(
        `Weak password attempted for email: ${email}`,
        UserService.name,
      );
      throw new ValidationFailedException(
        'Password must be at least 6 characters long',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepo.create({
      email,
      name,
      password: hashedPassword,
      provider: ProviderEnum.LOCAL,
    });

    this.logger.info(
      `User created successfully: ${user.uuid}`,
      UserService.name,
    );
    return user;
  }

  async validateUser(email: string, password: string): Promise<User> {
    this.logger.debug(`Validating user: ${email}`, UserService.name);

    const user = await this.userRepo.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, <string>user.password))) {
      this.logger.warn(`Invalid credentials for: ${email}`, UserService.name);
      throw new UnauthorizedException();
    }

    this.logger.info(`User validated successfully: ${email}`, UserService.name);
    return user;
  }

  async updateRefreshToken(userUuid: string, refreshToken: string) {
    this.logger.debug(
      `Updating refresh token for: ${userUuid}`,
      UserService.name,
    );
    await this.userRepo.update(userUuid, { refreshToken });
  }

  async upsertOAuthUser(oauthPayload: {
    email: string;
    name: string;
    provider: ProviderEnum;
  }) {
    this.logger.info(
      `Upserting OAuth user: ${oauthPayload.email}`,
      UserService.name,
    );

    let user = await this.userRepo.findByEmail(oauthPayload.email);
    if (!user) {
      user = await this.userRepo.create({ ...oauthPayload });
      this.logger.info(`OAuth user created: ${user.email}`, UserService.name);
    }

    return user;
  }

  async createOAuthUser(profile: {
    email: string;
    name: string;
    provider: ProviderEnum;
  }) {
    this.logger.info(
      `Creating new OAuth user: ${profile.email}`,
      UserService.name,
    );
    return this.userRepo.create({ ...profile });
  }

  getLoggedInUser() {
    const user = this.context.getUser();

    if (!user) {
      this.logger.warn(
        'Attempted to fetch logged-in user but none found in context',
        UserService.name,
      );
      throw new UnauthorizedException('User is not authenticated');
    }

    this.logger.debug(
      `Logged-in user: ${user.email || user.uuid}`,
      UserService.name,
    );
    return user;
  }
}
