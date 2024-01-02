import { Body, Controller, Delete, Get, Param, UseGuards, Post, ParseIntPipe, UsePipes, ValidationPipe, Request } from '@nestjs/common';
import { AdminMaster } from './admin-master.entity';
import { AdminMasterDto } from './dto/admin-master.dto';
import { AdminMasterService } from './admin-master.service';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import logger from 'src/loggerfile/logger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import * as path from 'path';

@ApiTags('Admin')
@ApiSecurity("JWT-auth")
@Controller('adminmaster')
export class AdminMasterController {
    private filepath: string;
    constructor(private readonly adminMasterService: AdminMasterService) { this.filepath = path.basename(__filename); }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Post('create')
    @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @UsePipes(new ValidationPipe())
    async create(@Request() req, @Body() adminMasterDto: AdminMasterDto) {
        logger.debug(`admin create is calling`);
        const result = await this.adminMasterService.create(req.user, adminMasterDto);
        logger.debug(`${this.filepath} > return in controller > ${result}`);
        return result;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Get()
    @ApiResponse({ status: 201, description: 'The All records fetched successfully.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async findAll() {
        logger.debug(`admin findall is calling`);
        const result = await this.adminMasterService.findAll();
        logger.debug(`${this.filepath} > return in controller > ${result}`);
        return result;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Get(':adminId')
    @ApiResponse({ status: 201, description: 'The record fetched successfully.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async findOne(@Param('adminId', ParseIntPipe) adminId: number) {
        logger.debug(`admin findone is calling`);
        const result = await this.adminMasterService.findOne(adminId);
        logger.debug(`${this.filepath} > return in controller > ${result}`);
        return result;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Delete(':adminId')
    @ApiResponse({ status: 201, description: 'The record removed successfully.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async remove(@Param('adminId') adminId: string) {
        logger.debug(`admin remove is calling`);
        const result = await this.adminMasterService.remove(adminId);
        logger.debug(`${this.filepath} > return in controller > ${result}`);
        return result;
    }
}
