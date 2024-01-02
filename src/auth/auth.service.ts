import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { TokenService } from './token.service';
import { compare } from 'bcrypt';
import { UserMasterService } from 'src/usermaster/user-master.service';
import logger from 'src/loggerfile/logger';
import * as path from 'path';

@Injectable()
export class AuthService {
  private filepath: string;
  constructor(
    private userMasterService: UserMasterService,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {
    this.filepath = path.basename(__filename);
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userMasterService.findByUsername(username);
    if (user.payload && (await compare(pass, user.payload.password))) {
      const { password, ...result } = user.payload;
      console.log("validateUser validate user ", result);
      return result;
    }
    return null;
  }

  async login(user: any) {
    try {
      console.log(" in login ", user);
      if (user.error) {
        throw user.message;
      }
      user = user.user;
      const payload = { error: false, username: user.username, sub: user.id, role: user.role, collegeId: user.college.id, collegeName: user.college.code, name: user.name };
      console.log("payload ", payload)

      const refreshToken = this.tokenService.generateRefreshToken(user.id);

      // Save the refresh token to the user record or any other secure storage mechanism

      const save = await this.userMasterService.saveRefreshToken(user.id, refreshToken);
      if (save.Error)
        throw save.message;
      return {
        Error: false,
        access_token: this.jwtService.sign(payload, { secret: jwtConstants.secret, expiresIn: jwtConstants.expirationTime, }),// Set the expiration time
        refresh_token: refreshToken,
      };
    } catch (error) {
      logger.error(`${this.filepath} > ${error} > in login`);
      return { Error: true, message: 'Invalid Credentials' };
    }
  }

  async logout(user: any) {
    try {
      await this.userMasterService.deleteRefreshToken(user.sub);
      // if(response.Error)
      //   throw response.message;
      return {
        Error: false,
        access_token: "",
        refresh_token: "",
      };
    } catch (error) {
      logger.error(`${error} > error in logout`);
      return { Error: true, message: (typeof error == 'object' ? error.message : error) };
    }
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const user = await this.userMasterService.findUserIdByRefreshToken(refreshToken);

      if (!user || user.Error) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate a new access token
      const payload = { sub: user.payload.id, username: user.payload.username, role: user.payload.role, collegeId: user.payload.college.id, collegeName: user.payload.college.code }; //if refresh token notworking please check payload once again
      const accessToken = this.jwtService.sign(payload, { secret: jwtConstants.secret, expiresIn: jwtConstants.expirationTime, });

      return accessToken;
    } catch (error) {
      logger.error(`${this.filepath} > ${error} > in generation refreshAccessToken`)
      return "";
    }
  }
}