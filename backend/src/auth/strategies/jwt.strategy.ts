import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    // @ts-ignore
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // read from Authorization: Bearer <token>
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET, // your secret
    });
  }

  async validate(payload: any) {
    // payload is what you signed (e.g. { sub: userId, email })
    return { uuid: payload.sub, email: payload.email, role: payload.role };
  }
}
