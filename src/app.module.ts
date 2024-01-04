import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserMasterModule } from './usermaster/user-master.module';
import { StudentMasterModule } from './studentmaster/student-master.module';
import { AdminMasterModule } from './adminmaster/admin-master.module';
import { TeacherMasterModule } from './teachermaster/teacher-master.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtExpiredFilter } from './auth/jwtExpired.filter';
import { MysqlModule } from './config/mysql/mysql.module';
import { MysqlService } from './config/mysql/mysql.service';
import { MysqlDatabaseProviderModule } from './config/mysql/provider.module';
import { ConfigAppModule } from './config/config.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler';
import { CollegeModule } from './college/college.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { AdminMaster } from './adminmaster/admin-master.entity';
import { UserMaster } from './usermaster/user-master.entity';
import { College } from './college/college.entity';
import { JwtService } from '@nestjs/jwt';

console.log(`${process.cwd()}/${process.env.NODE_ENV}.env`)
@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 10, // 10 seconds
      limit: 30, // 30 requests per ttl period
    }),
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        ttl: 21600,
      }),
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    ConfigAppModule, // Use the ConfigModule
    MysqlDatabaseProviderModule,
    UserMasterModule,
    StudentMasterModule,
    AdminMasterModule,
    TeacherMasterModule,
    AuthModule,
    TypeOrmModule,
    MysqlModule,
    CollegeModule,
    TypeOrmModule.forFeature([AdminMaster, UserMaster,College])
  ],
  controllers: [AppController],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: JwtExpiredFilter,
    },
    AppService, MysqlService,JwtService]
})
export class AppModule { }
