import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AdminMasterDto {

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

