import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TokenService {
  generateRefreshToken(): string {
    const refreshToken = uuidv4();
    return refreshToken;
  }
}
