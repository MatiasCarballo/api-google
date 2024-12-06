import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/Utils/auth.guard";
import { DriveService } from "./drive.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { createFolderDto } from "./drive.dto";

@ApiTags('Drive')
@UseGuards(AuthGuard)
@Controller('drive')
export class DriveController{
  constructor(
    private driveService:DriveService
  ){}

  
  @Get('/')
  @ApiBearerAuth()
  @ApiOperation({ summary: '' })
  @HttpCode(HttpStatus.OK)
  async getInfoDrive(@Req() req: any){
    //info del drive entero, memoria restante, etc...
    const result = await this.driveService.createFile(req.dataJwt,'');
      return { statusCode: HttpStatus.OK, result };
    }

/***************FILES*****************/

  @Get('/file/:fileId')
  @ApiBearerAuth()
  @ApiOperation({ summary: '' })
  @HttpCode(HttpStatus.OK)
  async getFileDrive(@Req() req: any, @Param() fileId:string ){
    const result = await this.driveService.createFile(req.dataJwt,fileId);//cambiar func
    return { statusCode: HttpStatus.OK, result };
  }

  @Post('/file')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '' })
  @HttpCode(HttpStatus.CREATED)
  async createFileDrive(@Req() req:any, @UploadedFile() file:any){
    console.log(file);
    
    const result = await this.driveService.createFile(req.dataJwt,file)
    return { statusCode: HttpStatus.OK, result };
  }

  @Delete('/file:fileId')
  @ApiBearerAuth()
  @ApiOperation({ summary: '' })
  @HttpCode(HttpStatus.OK)
  async deleteFileDrive(@Req() req: any, @Param() fileId:string ){
    await this.driveService.createFile(req.dataJwt,fileId);//cambiar func
    return { statusCode: HttpStatus.OK, message:'File Deleted' };
  }
/***************FOLDER*****************/

  @Get('/folder/:folderId')
  @ApiBearerAuth()
  @ApiOperation({ summary: '' })
  @HttpCode(HttpStatus.OK)
  async getFolderAndFilesDrive(@Req() req: any, @Param() folderId:string ){
    const result = await this.driveService.getFolder(req.dataJwt, folderId);
    return { statusCode: HttpStatus.OK, result };
  }

  @Get('/folders')
  @ApiBearerAuth()
  @ApiOperation({ summary: '' })
  @HttpCode(HttpStatus.OK)
  async getAllFolders(@Req() req: any){
    const result = await this.driveService.getAllFolders(req.dataJwt);
    return { statusCode: HttpStatus.OK, result };
  }

  @Post('/folder')
  @ApiBearerAuth()
  @ApiOperation({ summary: '' })
  @HttpCode(HttpStatus.CREATED)
  async createFolderDrive(@Req() req: any, @Body() data: createFolderDto){
    const result = await this.driveService.createFolderDrive(req.dataJwt, data);
    return { statusCode: HttpStatus.OK, result };
  }

  @Delete('/folder/:folderId')
  @ApiBearerAuth()
  @ApiOperation({ summary: '' })
  @HttpCode(HttpStatus.OK)
  async deleteFolderAndFilesDrive(@Req() req: any, @Param() folderId:string ){
    await this.driveService.createFile(req.dataJwt,folderId);//cambiar func
    return { statusCode: HttpStatus.OK, message:'Folder and Files Deleted' };
  }



}