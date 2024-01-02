import { Controller } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';;
import * as path from 'path';

@ApiTags('Student')
@ApiSecurity("JWT-auth")

@Controller('studentmaster')
export class StudentMasterController {
    private filepath: string;
    constructor() { this.filepath = path.basename(__filename); }
}
