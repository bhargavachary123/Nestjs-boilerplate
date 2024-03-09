import { Controller } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('Teacher')
@ApiSecurity("JWT-auth")

@Controller('teachermaster')
export class TeacherMasterController {}
