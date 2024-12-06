import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { DriveFolder } from "./driveFolder.schema";
import { createFolderDto, getUserInfoDto } from "./drive.dto";
import { UserService } from "src/User/user.service";
import { GoogleDrive } from "src/Utils/Services/googleDrive.service";
import { DriveFile } from "./driveFile.schema";


@Injectable()
export class DriveService{
  private userService:UserService;
  private googleDrive:GoogleDrive;

  constructor(
    private readonly moduleRef: ModuleRef,
    @InjectModel(DriveFolder.name) private DriveFolderModel: Model<DriveFolder>,
    @InjectModel(DriveFile.name) private DriveFileModel: Model<DriveFile>,
  ){ }
  onModuleInit(){
    this.userService = this.moduleRef.get(UserService, {
      strict: false,
    });
    this.googleDrive = this.moduleRef.get(GoogleDrive, {
      strict: false,
    });
  }

  async getFolder(data:getUserInfoDto, folderId:string){
    const folder = await this.DriveFolderModel.findOne({idUserG:data.id, folderId}).populate('DriveFiles');
    return folder
  }

  async getAllFolders(data:getUserInfoDto){
    const folders = await this.DriveFolderModel.find({idUserG:data.id});
    //funcion get driver
    return folders;
  }

  async createFolderDrive(user:getUserInfoDto, data:createFolderDto){
    try {
      if(data.name == 'root'){
        const folderId = await this.googleDrive.createDriveFolder(user, {name:data.name});
        return await this.DriveFolderModel.create({
          name: data.name,
          folderId,
        });
      }else{
        const userI = await this.userService.userInfo(user, true);
        const folderId = await this.googleDrive.createDriveFolder(userI, {name:data.name})
        return await this.DriveFolderModel.create({//AL CREAR UNA NUEVA CARPETA SE ACTUALIZA EL USER
          name: data.name,
          folderId,
        })
      }
    } catch (e) {
      console.log(e);
    }
  }



  async createFile(data: getUserInfoDto, file:any, folderIdG?:string){
    const userI = await this.userService.userInfo(data, true);
    if (folderIdG) {
      const fileIdG = await this.googleDrive.creteFile(userI, file, folderIdG);
      const fileM = await this.DriveFileModel.create({
        name: file.originalname,
        fileIdG,
        mimetype:file.mimetype
      });
      const fileIdM = fileM._id.toString();
      await this.updateFolderM(folderIdG, fileIdM);
    }else{
      const fileIdG = await this.googleDrive.creteFile(userI, file);
      const fileM = await this.DriveFileModel.create({
        name: file.originalname,
        fileIdG,
        mimetype:file.mimetype
      });
      
    }
    return 'ok';
  }

  async updateFolderM(folderId: string, fileIdM:string){
    await this.DriveFolderModel.updateOne({folderId}, { $pull: {DriveFiles:fileIdM}});
    return ''
  }

  async deleteFile(data: getUserInfoDto, fileIdG: string ){
    const userI = await this.userService.userInfo(data, true);
    await this.googleDrive.deleteFileDrive(userI,fileIdG);
    
    //continuar
    //archivo solo
    //archivo en carpetas
  }


}