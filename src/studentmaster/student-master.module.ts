import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentMaster } from './student-master.entity'
import { StudentMasterController } from './student-master.controller';
import { StudentMasterService } from './student-master.service';
import { UserMaster } from 'src/usermaster/user-master.entity';
import { UserMasterService } from 'src/usermaster/user-master.service';
import { HttpModule } from '@nestjs/axios';
import { EmailService } from 'src/email/email';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    TypeOrmModule.forFeature([StudentMaster, UserMaster]),
  ],
  controllers: [StudentMasterController],
  providers: [StudentMasterService, UserMasterService, EmailService]
})

export class StudentMasterModule { }
