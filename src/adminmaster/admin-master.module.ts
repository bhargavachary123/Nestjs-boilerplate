import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminMaster } from './admin-master.entity';
import { AdminMasterController } from './admin-master.controller';
import { AdminMasterService } from './admin-master.service';
import { UserMasterService } from 'src/usermaster/user-master.service';
import { UserMaster } from 'src/usermaster/user-master.entity';
import { EmailService } from 'src/email/email';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdminMaster, UserMaster]),
  ],
  controllers: [AdminMasterController],
  providers: [AdminMasterService, UserMasterService, EmailService]
})
export class AdminMasterModule { }
