import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe, Request, Delete, Param, ParseIntPipe, Put } from '@nestjs/common';
import { CollegeService } from './college.service';
import { CollegeDto, UpdateCollegeDto } from './dto/college.dto';
import { ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import logger from 'src/loggerfile/logger';
import * as path from 'path';
import { DataMethodResponseType, NormalMethodResponseType } from 'src/return.formats';

@ApiSecurity("JWT-auth")
@ApiTags('College')

@Controller('college')
export class CollegeController {
    private filepath: string;
    constructor(private readonly collegeService: CollegeService) { this.filepath = path.basename(__filename); }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Post('create')
    @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @UsePipes(new ValidationPipe())
    async create(@Request() req, @Body() collegeDto: CollegeDto): Promise<NormalMethodResponseType> {
        logger.debug(`college create is calling`);
        const result = await this.collegeService.create(req.user.username, collegeDto);
        logger.debug(`${this.filepath} > return in controller > ${result}`);
        return result;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Get()
    @ApiResponse({ status: 201, description: 'The All records fetched successfully.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async findAll(): Promise<DataMethodResponseType> {
        logger.debug(`college findAll is calling`);
        const result = await this.collegeService.findAll();
        logger.debug(`${this.filepath} > return in controller > ${result}`);
        return result;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Get(':clgId')
    @ApiResponse({ status: 201, description: 'The record fetched successfully.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async findOne(@Param('clgId', ParseIntPipe) clgId: number): Promise<DataMethodResponseType> {
        logger.debug(`college findOne is calling`);
        const result = await this.collegeService.findOne(clgId);
        logger.debug(`${this.filepath} > return in controller > ${result}`);
        return result;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Delete(':clgId')
    @ApiResponse({ status: 201, description: 'The record removed successfully.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async remove(@Param('clgId') clgId: string): Promise<NormalMethodResponseType> {
        logger.debug(`college remove is calling`);
        const result = await this.collegeService.remove(clgId);
        logger.debug(`${this.filepath} > return in controller > ${result}`);
        return result;
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Put('update')
    @ApiResponse({ status: 201, description: 'The record updated successfully.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @UsePipes(new ValidationPipe())
    async update(@Request() req, @Body() updateCollegeDto: UpdateCollegeDto): Promise<NormalMethodResponseType> {
        logger.debug(`college update is calling`);
        const result = await this.collegeService.update(req.user.username, updateCollegeDto);
        logger.debug(`${this.filepath} > return in controller > ${result}`);
        return result;
    }
}
