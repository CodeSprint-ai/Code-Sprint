import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private configService: ConfigService) {
        const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
        const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');

        if (!clientID || !clientSecret) {
            throw new Error('Google OAuth credentials not found');
        }

        super({
            clientID,
            clientSecret,
            callbackURL: `${configService.get<string>('BASE_URL')}/auth/google/callback`,
            scope: ['email', 'profile'],
            passReqToCallback: true,
        });
    }

    async validate(
        req: Request,
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: Function,
    ): Promise<any> {
        const user = {
            email: profile.emails?.[0]?.value,
            name: profile.displayName,
            provider: 'google',
            googleId: profile.id,
        };

        done(null, user);
    }
}
