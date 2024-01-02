import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Cron } from '@nestjs/schedule';
import * as path from 'path';
import * as fs from 'fs';
import logger from './loggerfile/logger';

@Injectable()
export class AppService {
  private filepath: string;
  constructor(
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.filepath = path.basename(__filename);
   }
  getHello(): string {
    const date = new Date()
    return (`API : Hello World !! ${date}`);
  }
  @Cron('* * * * *', {
    name: 'cornjob',
    timeZone: 'Asia/Kolkata',
  })
  handleCron() {
    console.log('Called every 1 min');
    this.eventEmitter.emit('event')
  }

  @OnEvent('event')
  handleevent() {
    console.log("cron job event occured")
  }
  
  async uploadPdfs(file: any, dynamicPath?: string, name?: string) {
    try {

      let time = new Date().getTime();
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
      logger.debug(`uploadFiles started`);
      let time = new Date().getTime();
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
}
