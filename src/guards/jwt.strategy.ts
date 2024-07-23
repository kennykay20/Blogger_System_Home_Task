import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { configs } from '../config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKey: configs.secret,
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
    });
  }

  private static extractJWT(req: Request): string | null {
    if (req.cookies && 'blogger_token' in req.cookies) {
      return req.cookies.blogger_token;
    }
    return null;
  }

  async validate(payload: { id: any; username: string }) {
    console.log('inside the validate method');
    return payload;
  }
}
