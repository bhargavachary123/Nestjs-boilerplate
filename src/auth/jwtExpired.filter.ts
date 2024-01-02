// jwtExpired.filter.ts

import { ExceptionFilter, Catch, ArgumentsHost, UnauthorizedException } from '@nestjs/common';
import { TokenExpiredError } from 'jsonwebtoken';

@Catch(TokenExpiredError)
export class JwtExpiredFilter implements ExceptionFilter {
  catch(exception: TokenExpiredError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = 401; // Unauthorized status code

    response.status(status).json({
      statusCode: status,
      message: 'JWT token has expired', // Custom error message for token expiration
    });
  }
}
