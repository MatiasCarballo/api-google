import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./user.schema";
import { Model } from "mongoose";
import { ModuleRef } from "@nestjs/core";
import { EncriptionService } from "src/Utils/encryption.service";
import { JwtService } from "@nestjs/jwt";
import { GoogleAuth } from "src/Utils/Services/googleAuth.service";
import { getUserDto } from "./user.dto";
import { DriveService } from "src/DriveFile/drive.service";
import { CalendarService } from "src/Calendar/calendarEvent.service";


@Injectable()
export class UserService {

  private encriptionService: EncriptionService;
  private googleAuth: GoogleAuth;
  private driveService: DriveService;
  private calendarService: CalendarService;

  constructor(
    private readonly moduleRef: ModuleRef,
    private jwtService:JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  )
  { }

  onModuleInit() {
    this.encriptionService = this.moduleRef.get(EncriptionService, {
      strict: false,
    });
    this.googleAuth = this.moduleRef.get(GoogleAuth, {
      strict: false,
    });
    this.driveService = this.moduleRef.get(DriveService, {
      strict: false,
    });
    this.calendarService = this.moduleRef.get(CalendarService, {
      strict: false,
    });
  }

  

  async login() {
    const c =  await this.googleAuth.urlAuth();    
    return c
  }

  async callback(code:any) {     
    try {      
      const data = await this.googleAuth.getTokenAndInfoUser(code);
      const encripToken = this.encriptionService.encriptionToken(JSON.stringify(data.tokens));
      
      let user = await this.userModel.findOne({idUserG: data.data.sub});
      if(!user){
        const RefreshToken = this.encriptionService.encriptionToken(JSON.stringify(data.tokens.refresh_token));
        const tokenUser = {
          id:data.data.sub,
          name:data.data.name,
          token:encripToken,
          RToken:RefreshToken
        }
        const folderRoot = await this.driveService.createFolderDrive(tokenUser, {name:'root'});
        const calendarRoot = await this.calendarService.createCalendar(tokenUser);
        user = await this.userModel.create({
          idUserG: data.data.sub,
          name: data.data.name,
          token:encripToken,
          RToken:RefreshToken,
          folderRootM: folderRoot._id.toString(),
          email:data.data.email

        });
      }
      return this.jwtService.sign({'name':user.name, 'id':user.idUserG});      
    } catch (e) {
      console.log(e);
    }
  }

  async userInfo(data:getUserDto, token?:boolean): Promise<User>{
    try {
      this.googleAuth.refreshToken(data);
      const user = await this.userModel.findOne({idUserG:data.id}).select(`${token? '+token +RToken': ''}`);
      if (!user) throw new UnauthorizedException('User not found');
      return user;
    } catch (e) {
      console.log(e);
      throw new NotFoundException('User not found')
    }
  }


}
