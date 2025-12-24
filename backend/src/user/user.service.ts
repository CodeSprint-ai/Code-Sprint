import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterCommand } from 'src/auth/command/register.command';
import * as bcrypt from 'bcrypt';
import { ValidationFailedException } from 'src/common/exceptions/ValidationFailedException';
import { RequestContextService } from 'src/common/services/request-context.service';
import { AppLogger } from 'src/common/services/logger.service';
import { ProviderEnum } from 'src/auth/enum/ProviderEnum';
import { User } from './entities/user.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEnum } from './enum/RoleEnum';
import { UserLevel } from './enum/UserLevel';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly context: RequestContextService,
    private readonly logger: AppLogger,
  ) {}

  async createLocalUser(command: RegisterCommand): Promise<User> {
    const { email, password, name } = command;

    this.logger.info(`Creating local user: ${email}`, UserService.name);

    const existingUser = await this.userRepository.findOneBy({ email });
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

    const user = this.userRepository.create({
      email,
      name,
      password: hashedPassword,
      provider: ProviderEnum.LOCAL,
      isVerified: false,
      role: RoleEnum.USER,
      level: UserLevel.BEGINNER,
    });
    const savedUser = await this.userRepository.save(user);
    this.logger.info(
      `User created successfully: ${savedUser.uuid}`,
      savedUser.name,
    );
    return savedUser;
  }

  async validateUser(email: string, password: string): Promise<User> {
    this.logger.debug(`Validating user: ${email}`, UserService.name);

    const user = await this.userRepository.findOneBy({ email });
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
    await this.userRepository.update(userUuid, { refreshToken });
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

    let user = await this.userRepository.findOneBy({
      email: oauthPayload.email,
    });
    if (!user) {
      user = this.userRepository.create({ ...oauthPayload });
      user = await this.userRepository.save(user);
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
    const user = this.userRepository.create({ ...profile });
    return this.userRepository.save(user);
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
