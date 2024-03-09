import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import logger from 'src/loggerfile/logger';

@Injectable()
export class CustomJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, _info: any, context: ExecutionContext) {
    if (err || !user) {
      // Handle UnauthorizedException specifically for token expiration
      if (err instanceof UnauthorizedException && err.message === 'jwt expired') {
        logger.error (context)
        throw new UnauthorizedException('JWT token has expired');
      }
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
