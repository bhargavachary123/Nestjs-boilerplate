import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const isTokenExpired = Date.now() > payload.exp * 1000;
    if (isTokenExpired) {
      throw new UnauthorizedException('Session has been expired, Please Login Again');
    }

    return { usermasterId: payload.usermasterId, id: payload.id, username: payload.username, role:payload.role, collegeId:payload.collegeId, collegeName: payload.collegeName, name: payload.name };
  }
  
}
