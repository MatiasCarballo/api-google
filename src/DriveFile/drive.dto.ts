import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class getUserInfoDto {
  // @ApiProperty({ description: '' })
  @IsString()
  @IsNotEmpty()
  id:string;

  @IsString()
  @IsNotEmpty()
  name:string;

  @IsString()
  @IsNotEmpty()
  token?: string;

  @IsString()
  @IsNotEmpty()
  RToken?: string;
}


export class createFolderDto {
  // @ApiProperty({ description: '' })
  @IsString()
  @IsNotEmpty()
  name :string;

  @IsString()
  @IsNotEmpty()
  folder?:string;
}