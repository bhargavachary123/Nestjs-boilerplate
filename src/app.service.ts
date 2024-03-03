import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Cron } from '@nestjs/schedule';
import * as path from 'path';
import * as fs from 'fs';
import logger from './loggerfile/logger';
import { College } from './college/college.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RType, UserMaster } from './usermaster/user-master.entity';
import { Repository } from 'typeorm';
import { AdminMaster } from './adminmaster/admin-master.entity';
import { hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';

@Injectable()
export class AppService {
  private filepath: string;
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(UserMaster)
    private readonly userMasterRepository: Repository<UserMaster>,
    @InjectRepository(AdminMaster)
    private readonly adminMasterRepository: Repository<AdminMaster>,
    @InjectRepository(College)
    private readonly collegeRepository: Repository<College>,
    private jwtService: JwtService,
  ) {
    this.filepath = path.basename(__filename);
  }
  getHello(): string {
    const date = new Date()
    return (`API : Hello World !! ${date}. The Aplication has been set up successfully`);
  }
  @Cron('1 * * * *', {
    name: 'cornjob',
    timeZone: 'Asia/Kolkata',
  })
  handleCron() {
    this.eventEmitter.emit('event')
  }

  @OnEvent('event')
  handleevent() {
    console.log("cron job event occured");
    console.log("event has been executed");
  }

  async uploadPdfs(file: any, dynamicPath?: string, name?: string) {
    try {
      logger.debug(`uploadPdfs started`);
      const time = new Date().getTime();
      const pdfname = (file.originalname).split(".pdf");
      const pdfname2 = pdfname[0].split(' ').join('_');
      const fileName = name ?? `${pdfname2}_${time}.${file.fieldname}`;
      const dir = path.join(__dirname, '../../public', dynamicPath);
      const filePath = path.join(dir, fileName);

      await fs.promises.mkdir(dir, { recursive: true });
      await fs.promises.writeFile(filePath, file.buffer);
      return {
        Error: false,
        status: true,
        data: {
          url: filePath.replace(path.join(dir, '../../../'), ''),
          id: file.originalname.replace(/\s/g, '').split('.')[0],
        },
      };
    } catch (error) {
      logger.error(`${this.filepath} > ${error} in uploding pdf in pdfs`);
      return { Error: true, status: false, message: "error in uploading" };
    }
  }

  async uploadImg(file: any, dynamicPath?: string, name?: string) {
    try {
      logger.debug(`uploadImg started`);
      const time = new Date().getTime();
      const imagename = (file.originalname).split(".");
      const fileName = name ?? `${imagename[0]}_${time}.png`;
      const dir = path.join(__dirname, '../../public', dynamicPath);
      const filePath = path.join(dir, fileName);

      await fs.promises.mkdir(dir, { recursive: true });
      await fs.promises.writeFile(filePath, file.buffer);
      return {
        Error: false,
        payload: {
          status: true,
          data: {
            url: filePath.replace(path.join(dir, '../../'), ''),
            id: file.originalname.replace(/\s/g, '').split('.')[0],
          },
        },
      };
    } catch (error) {
      logger.error(`${this.filepath} > ${error} in uploding Image in Imgs`);
      return { Error: true, status: false, message: (typeof error == 'object' ? error.message : error) };
    }
  }

  async seeder(): Promise<any> {
    try {
      const colleges = await this.collegeRepository.find();
      if (colleges.length == 0) {
        console.log("college")
        const college = new College();
        college.name = "example college";
        college.code = "clg";
        colleges[0] = await this.collegeRepository.save(college);
      }
      const admins = await this.userMasterRepository.find();
      if (admins.length == 0) {
        const username = "admin";
        const password = "admin";
        const user = new UserMaster();
        user.username = username;
        user.password = await hash(password, 10);
        user.role = RType.ADMIN;
        user.college = { id: colleges[0].id } as College;
        const res = await this.userMasterRepository.save(user);
        const admin = new AdminMaster();
        admin.name = username;
        admin.usermaster = { id: res.id } as UserMaster;
        await this.adminMasterRepository.save(admin);
        const payload = { error: false, username: username, sub: res.id, role: user.role, collegeId: colleges[0].id, collegeName: colleges[0].code, name: username };
        const access_token = this.jwtService.sign(payload, { secret: jwtConstants.secret, expiresIn: jwtConstants.expirationTime });
        return `
        <div style="display: flex;width:500px; flex-direction: column; align-items: center; overflow-x: hidden; overflow-y: scroll; margin-top: 100px; border: 2px solid black; max-width: 80%; overflow: auto;">
        <p style="text-align: center;">Database initialized successfully.</p>
        <p style="text-align: center;">Access Token: ${access_token}</p>
    </div>
    `;
      }
      return "Database already initialized successfully."
    } catch (error) {
      return error.message;
    }
  }
}
