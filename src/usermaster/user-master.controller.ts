import { Controller } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@ApiSecurity("JWT-auth")

@Controller('usermaster')
export class UserMasterController {}
