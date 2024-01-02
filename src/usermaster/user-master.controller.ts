import { Controller } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import * as path from 'path';

@ApiTags('User')
@ApiSecurity("JWT-auth")

@Controller('usermaster')
export class UserMasterController {
    private filepath: string;
    constructor() { this.filepath = path.basename(__filename); }
}
