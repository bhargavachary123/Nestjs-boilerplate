import { Module } from '@nestjs/common';
import { CollegeController } from './college.controller';
import { CollegeService } from './college.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { College } from './college.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => ({
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        ttl: 21600,
      }),
    }),
    TypeOrmModule.forFeature([College])],
  controllers: [CollegeController],
  providers: [CollegeService],
})
export class CollegeModule { }
