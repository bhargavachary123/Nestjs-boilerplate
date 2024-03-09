import { Controller } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';;

@ApiTags('Student')
@ApiSecurity("JWT-auth")

@Controller('studentmaster')
export class StudentMasterController {}
