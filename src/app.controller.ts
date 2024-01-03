import { Body, Controller, FileTypeValidator, Get, HttpException, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Roles } from './auth/roles.decorator';
import { RolesGuard } from './auth/roles.guard';
import { Response } from 'express'; // Import the Response class from the express module
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import * as path from 'path';
import * as fs from 'fs';
import { FileInterceptor } from '@nestjs/platform-express';
import logger from './loggerfile/logger';

@ApiTags("Home")

@Controller('')
export class AppController {

  constructor(private readonly appService: AppService) { }


  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('initialize')
  seeder(): Promise<any> {
    return this.appService.seeder();
  }

  @Get('message')
  LoginScreenMessage() {
    const htmlCodeOff = ''
    const htmlCodeOn = `
      <html>
        <head>
          <style>
            .msg-body {              
              position: relative;              
            }          

            .msg-div {
              // background-color: linen;
              // height:100vh;
              width:100%;
              position: absolute;              
              z-index: 999;
            }            
            .msg{
              font-size:16px;
              color:red;
              padding:20px;
            }
          </style>
        </head>
        <body class = 'msg-body'>
          <div class = 'msg-div'> 
            <h3 style="margin-top:10px;">Site Maintenance Notice</h3>           
            <p class = 'msg'><marquee>Our website will be undergoing scheduled maintenance between 4 PM and 5 PM. During this time, the site will be temporarily unavailable. We apologize for any inconvenience this may cause. Please check back after 5 PM for the regular service.</marquee></p>
          </div>
        </body>
      </html>
    `
    return { Error: false, htmlcode: htmlCodeOff };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiSecurity("JWT-auth")
  @Get('pdfs/:filename')
  @ApiResponse({ status: 201, description: 'response successfull' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async pdfserveFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(__dirname, '..', 'public/pdfs', filename);
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiSecurity("JWT-auth")
  @Get('pngs/:filename')
  @ApiResponse({ status: 201, description: 'response successfull' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async pngserveFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(__dirname, '..', 'public/Imgs', filename);
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('pdffile')
  @ApiResponse({ status: 201, description: 'The record updated successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseInterceptors(FileInterceptor('pdf'))
  async updateProfile(@Request() req,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10000000 }), // 10 mb
          new FileTypeValidator({ fileType: 'application/pdf' }),
        ],
      }),
    ) file: Express.Multer.File) {
    try {
      if (file) {
        // const filePath = await this.badgesService.uploadFiles(file, "pdfs");
        const filePath = await this.appService.uploadPdfs(file, "pdfs");
        if (filePath.Error)
          throw filePath.message;
        return filePath;
      }
    }
    catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('imgfile')
  @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @UseInterceptors(FileInterceptor('image'))
  async uploadImg(@Request() requestAnimationFrame,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }), //bytes 1000kb
          new FileTypeValidator({ fileType: 'image' }),
        ],
      }),
    ) file: Express.Multer.File) {
    try {
      logger.debug(`uploadImg is calling`);
      if (file) {
        const filePath = await this.appService.uploadImg(file, "Imgs");
        logger.debug(`return from uploadImg > ${filePath}`);
        if (filePath.Error)
          throw filePath.message;
        return filePath;
      }
    }
    catch (error) {
      return { Error: true, message: (typeof error == 'object' ? error.message : error) };
    }
  }
}


