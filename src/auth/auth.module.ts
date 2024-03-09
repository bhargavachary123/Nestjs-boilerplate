import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { TokenService } from './token.service';
import { UserMasterModule } from 'src/usermaster/user-master.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMasterService } from 'src/usermaster/user-master.service';
import { UserMaster } from 'src/usermaster/user-master.entity';
import { EmailService } from 'src/email/email';

@Module({
  imports: [
    UserMasterModule,
    PassportModule,
    JwtModule.register({
      secret: "thisisasecretkey",
      signOptions: { expiresIn: '60s' },
    }),
    TypeOrmModule.forFeature([UserMaster]),
],
  providers: [AuthService,LocalStrategy,JwtStrategy,TokenService,UserMasterService,EmailService],
  exports: [AuthService,TokenService],
  controllers: [AuthController]
})
export class AuthModule {}
