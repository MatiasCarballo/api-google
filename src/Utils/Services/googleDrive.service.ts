import { BadRequestException, Injectable } from "@nestjs/common";
import { GoogleAuth } from "./googleAuth.service";
import { EncriptionService } from "../encryption.service";
import { drive } from "@googleapis/drive";
import { ModuleRef } from "@nestjs/core";
import { Readable } from "stream";


@Injectable()
export class GoogleDrive{
  private googleAuth: GoogleAuth;
  private encriptionService: EncriptionService;

  constructor(
    private readonly moduleRef: ModuleRef,
  ){}

  onModuleInit(){
    this.googleAuth = this.moduleRef.get(GoogleAuth, {
      strict: false,
    });
    this.encriptionService = this.moduleRef.get(EncriptionService, {
      strict: false,
    }); 
  }

  async getclient(user){
    const tokenDesencrypt = JSON.parse(this.encriptionService.decryptToken(user.token));
    const RTokenDesencrypt = JSON.parse(this.encriptionService.decryptToken(user.RToken));
    tokenDesencrypt.refresh_token = RTokenDesencrypt

    const oauthClient = await this.googleAuth.oauthClient();
    oauthClient.setCredentials(tokenDesencrypt);
    return drive({version: 'v3', auth: oauthClient});
  } 

  async createDriveFolder(user, data){
    try {
      const client = await this.getclient(user);

      const fileMetadata = {
        name: data.name,
        parents: [],//id de carpeta contenedora
        mimeType: 'application/vnd.google-apps.folder',
      };
      const res =await client.files.create({
        requestBody: fileMetadata,
        fields: 'id, name , webViewLink, parents',
      });
      console.log(res.data.id);
      
      return res.data.id;      
    } catch (e) {
      console.log(e);
      //throw new BadRequestException('creacion de carpetas');
    }
  }

  async creteFile(user, file, folderIdG?){
    
    const client = await this.getclient(user);

    const fileStream = new Readable();
    fileStream.push(file.buffer);
    fileStream.push(null); 

    const fileData = await client.files.create({
      requestBody:{
        name:file.originalname,
        parents:[folderIdG],//se podria usar us id default
      },
      media:{
        mimeType:file.mimetype,
        body:fileStream,
      },
      fields:'id',
    })

    console.log(fileData);
    return fileData.data.id
  }

  async getfile(user, fileId){
    const client = await this.getclient(user);

    const response = await client.files.get({
      fileId,
      supportsAllDrives: true,
      includePermissionsForView: '',
      fields: "id,name, mimeType, thumbnailLink, iconLink, webViewLink, parents"
    });

    return response;
  }


  async deleteFileDrive(user, fileId){
    const client = await this.getclient(user);
    await client.files.delete({ fileId });
    return fileId
  }

  async infoDriver(user){
    const client = await this.getclient(user);
    const result = await client.about.get({
      fields:'storageQuota,user'
    });
    return result.data;
  }
}