import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class StudentMasterDto {

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  currentyear: number;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ type: String })
  @IsString()
  CGPA: string;

}

export class UpdateStudentMasterDto {

  @ApiProperty({ type: Number, description: "studentid" })
  @IsNotEmpty()
  @IsNumber()
  id: number; //studentid

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  currentyear: number;

  @ApiProperty({ type: String })
  @IsString()
  CGPA: string;
}


export class StudentMasterBulkDto {

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsEmail()
  email: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  currentyear: number;

  @ApiProperty({ type: String })
  @IsString()
  password: string;

  @ApiProperty({ type: String })
  @IsString()
  CGPA: string;

}