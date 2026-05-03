// src/auth/strategies/github.strategy.ts

import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
    constructor(private configService: ConfigService) {
        const clientID = configService.get<string>('GITHUB_CLIENT_ID');
        const clientSecret = configService.get<string>('GITHUB_CLIENT_SECRET');

        if (!clientID || !clientSecret) {
            throw new Error('GitHub OAuth credentials not found');
        }

        super({
            clientID,
            clientSecret,
            callbackURL: `${configService.get<string>('BASE_URL')}/auth/github/callback`,
            scope: ['user:email'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any) {
        return {
            email: profile.emails[0].value,
            name: profile.displayName || profile.username,
            provider: 'github',
        };
    }
}
