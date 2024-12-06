import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class getUserDto {
  // @ApiProperty({ description: '' })
  @IsString()
  @IsNotEmpty()
  id:string;

  @IsString()
  @IsNotEmpty()
  name:string;
}