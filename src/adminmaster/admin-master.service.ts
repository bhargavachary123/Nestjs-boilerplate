import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminMaster } from './admin-master.entity';
import { AdminMasterDto } from './dto/admin-master.dto';
import { UserMasterService } from 'src/usermaster/user-master.service';
import { UserMaster } from 'src/usermaster/user-master.entity';
import logger from 'src/loggerfile/logger';
import * as path from 'path';
import { UserRole } from 'src/enum';
import { DataMethodResponseType, NormalMethodResponseType } from 'src/return.formats';

@Injectable()
export class AdminMasterService {
    private filepath: string;
    constructor(
        @InjectRepository(AdminMaster)
        private readonly adminMasterRepository: Repository<AdminMaster>,
        private readonly userMasterService: UserMasterService
    ) {
        this.filepath = path.basename(__filename);
    }

    async create(userInfo, adminMasterDto: AdminMasterDto): Promise<NormalMethodResponseType> {
        try {
            logger.debug(`admin create started`);
            const userdata = { "username": adminMasterDto.username, "password": adminMasterDto.password, "role": UserRole.ADMIN, "collegeId": userInfo.collegeId, "email": adminMasterDto.email };
            logger.debug(`user create is calling with values > ${JSON.stringify(userdata)}`);
            const user = await this.userMasterService.create(userInfo.username, userdata);
            logger.debug(`return from user create > ${JSON.stringify(user)}`)
            if (user.Error)
                throw user.message;
            const adminMaster = new AdminMaster();
            adminMaster.name = adminMasterDto.name;
            adminMaster.usermaster = { id: user.payload.id } as UserMaster;
            adminMaster.updatedBy = userInfo.username;
            await this.adminMasterRepository.save(adminMaster);
            logger.debug(`${this.filepath} > admin saved & returned`);
            return { Error: false, message: "created" };
        } catch (error) {
            logger.error(`${this.filepath} > ${error} > in creating admin`);
            return { Error: true, message: (typeof error == 'object' ? error.message : error) };
        }
    }

    async findAll(): Promise<DataMethodResponseType> {
        try {
            logger.debug("admin findAll started");
            const result = await this.adminMasterRepository.find();
            logger.debug(`${this.filepath} > returned > ${JSON.stringify(result)}`);
            return { Error: false, payload: result };
        } catch (error) {
            logger.error(`${this.filepath} > ${error} > in findAll admin`);
            return { Error: true, message: (typeof error == 'object' ? error.message : error) };
        }
    }

    async findOne(adminId: number): Promise<DataMethodResponseType> {
        try {
            logger.debug("admin findOne started");
            const result = await this.adminMasterRepository.findOneBy({ id: adminId });
            logger.debug(`${this.filepath} > returned > ${JSON.stringify(result)}`);
            return { Error: false, payload: result };
        } catch (error) {
            logger.error(`${this.filepath} > ${error} > in findone admin`);
            return { Error: true, message: (typeof error == 'object' ? error.message : error) };
        }
    }

    async remove(adminId: string): Promise<NormalMethodResponseType> {
        try {
            logger.debug(`admin remove started`);
            await this.adminMasterRepository.delete(adminId);
            logger.debug(`${this.filepath} > admin deleted & returned`);
            return { Error: false, message: "deleted" }
        } catch (error) {
            logger.error(`${this.filepath} > ${error} > in deleting admin`);
            return { Error: true, message: (typeof error == 'object' ? error.message : error) };
        }
    }
}
