import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshDto } from './dto/refresh.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from './roles.guard';
import { Roles } from './roles.decorator';

@ApiTags('LogIn')
@ApiSecurity("JWT-auth")

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('refresh')
  @ApiResponse({ status: 201, description: 'The token refresh successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async refreshAccessToken(@Body() refreshDto: RefreshDto) {
    const accessToken = await this.authService.refreshAccessToken(refreshDto.refreshToken);
    return { access_token: accessToken };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiResponse({ status: 201, description: 'The login successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async login(@Request() req) {
    return this.authService.login(req.user)
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles( 'ADMIN')
  @Get('logout')
  @ApiResponse({ status: 201, description: 'logout successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  logout(@Request() req) {
    return this.authService.logout(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiResponse({ status: 201, description: 'The request successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getProfile(@Request() req) {
    return req.user;
  }

}
