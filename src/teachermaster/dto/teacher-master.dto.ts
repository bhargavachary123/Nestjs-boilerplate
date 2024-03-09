import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class TeacherMasterDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({type:[Number]})
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true }) // Check each element in the array to be a number
  sub: number[];
  
}
export class TeacherMasterBulkDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ type: String })
  @IsString()
  password: string;

  @ApiProperty({type:[Number]})
  @IsArray()
  sub: number[];
  
}

export class UpdateTeacherMasterDto {

  @ApiProperty({ type: Number, description:"teacherid" })
  @IsNotEmpty()
  @IsNumber()
  id: number; //id is teacherid

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({type:[Number]})
  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true }) // Check each element in the array to be a number
  sub: number[];
}
