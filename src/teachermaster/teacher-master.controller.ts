import { Controller } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

import * as path from 'path';


@ApiTags('Teacher')
@ApiSecurity("JWT-auth")

@Controller('teachermaster')
export class TeacherMasterController {
    private filepath: string;
    constructor() { this.filepath = path.basename(__filename); }
}
