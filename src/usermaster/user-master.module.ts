import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMaster } from './user-master.entity';
import { UserMasterController } from './user-master.controller';
import { UserMasterService } from './user-master.service';
import { AuthService } from 'src/auth/auth.service';
import { TokenService } from 'src/auth/token.service';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from 'src/email/email';
// import { CacheModule } from '@nestjs/cache-manager';
// import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [TypeOrmModule.forFeature([UserMaster]),JwtModule,
],
  controllers: [UserMasterController],
  providers: [UserMasterService, AuthService, TokenService, EmailService],
  exports: [UserMasterService]
})
export class UserMasterModule {}
