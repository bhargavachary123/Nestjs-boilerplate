import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherMaster } from './teacher-master.entity';
import { TeacherMasterController } from './teacher-master.controller';
import { TeacherMasterService } from './teacher-master.service';
import { UserMasterService } from 'src/usermaster/user-master.service';
import { UserMaster } from 'src/usermaster/user-master.entity';
import { EmailService } from 'src/email/email';
import { StudentMasterService } from 'src/studentmaster/student-master.service';
import { StudentMaster } from 'src/studentmaster/student-master.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule.register({
      timeout: 300000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forFeature([TeacherMaster, UserMaster, StudentMaster]),
  ],
  controllers: [TeacherMasterController],
  providers: [TeacherMasterService, UserMasterService, EmailService, StudentMasterService]
})
export class TeacherMasterModule { }
