import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CollegeDto {

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class UpdateCollegeDto {

  @ApiProperty({ type: Number, description: "Collegeid" })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name: string;
}