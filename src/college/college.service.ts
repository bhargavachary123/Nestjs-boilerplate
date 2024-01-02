import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { College } from './college.entity';
import { CollegeDto, UpdateCollegeDto } from './dto/college.dto';
import logger from 'src/loggerfile/logger';
import { Connection } from 'typeorm';
import * as path from 'path';

@Injectable()
export class CollegeService {
    private filepath: string;
    constructor(
        @InjectRepository(College)
        private readonly collegeRepository: Repository<College>,
        private readonly connection: Connection,
    ) {
        this.filepath = path.basename(__filename);
    }

    async create(username: string, collegeDto: CollegeDto) {
        try {
            logger.debug(`college create started`);
            const college = new College();
            college.code = collegeDto.code;
            college.name = collegeDto.name;
            college.updatedby = username;

            await this.collegeRepository.save(college);
            logger.debug(`${this.filepath} > college saved & returned`);
            return { Error: false, message: "created" };
        } catch (error) {
            logger.error(`${this.filepath} > ${error} > in creating college`);
            return { Error: true, message: (typeof error == 'object' ? error.message : error) };
        }
    }

    async findAll() {
        try {
            logger.debug("college findAll started");
            const result = await this.collegeRepository.find();
            logger.debug(`${this.filepath} > returned > ${JSON.stringify(result)}`);
            return { Error: false, payload: result };
        } catch (error) {
            logger.error(`${this.filepath} > ${error} > in findAll college`);
            return { Error: true, message: (typeof error == 'object' ? error.message : error) };
        }
    }

    async findOne(clgId: number) {
        try {
            logger.debug("college findOne started");
            const result = await this.collegeRepository.findOneBy({ id: clgId });
            logger.debug(`${this.filepath} > returned > ${JSON.stringify(result)}`);
            return { Error: false, payload: result };
        } catch (error) {
            logger.error(`${this.filepath} > ${error} > in findOne college`);
            return { Error: true, message: (typeof error == 'object' ? error.message : error) };
        }

    }

    async remove(clgId: string) {
        try {
            logger.debug("college remove started");
            await this.collegeRepository.delete(clgId);
            logger.debug(`${this.filepath} > college removed & returned`);
            return { Error: false, message: "removed" };
        } catch (error) {
            logger.error(`${this.filepath} > ${error} > in removing college`);
            return { Error: true, message: (typeof error == 'object' ? error.message : error) };
        }
    }

    async update(username: string, updateCollegeDto: UpdateCollegeDto) {
        try {
            logger.debug("college update started");
            const college = await this.collegeRepository.findOneBy({ id: updateCollegeDto.id });
            if (!college) {
                // Handle case where the College with the given id is not found
                logger.debug(`${this.filepath} > college with id ${updateCollegeDto.id} not found.`);
                throw new Error(`College with id ${updateCollegeDto.id} not found.`);
            }
            college.code = updateCollegeDto.code || college.code;
            college.name = updateCollegeDto.name || college.name;
            college.updatedby = username;

            await this.collegeRepository.save(college);
            logger.debug(`${this.filepath} > college updated & returned`);
            return { Error: false, message: "updated" };
        } catch (error) {
            logger.error(`${this.filepath} > ${error} > in updating college`);
            return { Error: true, message: error.message };
        }
    }
}
