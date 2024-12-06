import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import axios from "axios";
import { google } from "googleapis";
import { Model } from "mongoose";
import { User } from "src/User/user.schema";
import { EncriptionService } from "../encryption.service";
import { ModuleRef } from "@nestjs/core";

@Injectable()
export class GoogleAuth {
  private GOOGLE_CLIENT_ID : string;
  private GOOGLE_CLIENT_SECRET : string;
  private URI : string;
  private encriptionService: EncriptionService;

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly configService: ConfigService,
    private readonly moduleRef: ModuleRef,
  ){
    this.GOOGLE_CLIENT_ID = this.configService.get('GOOGLE_CLIENT_ID');
    this.GOOGLE_CLIENT_SECRET = this.configService.get('GOOGLE_CLIENT_SECRET');
    this.URI = this.configService.get('URI');
  }

  onModuleInit() {
    this.encriptionService = this.moduleRef.get(EncriptionService, {
      strict: false,
    });
  }

  async oauthClient() {
    return new google.auth.OAuth2(
      this.GOOGLE_CLIENT_ID,
      this.GOOGLE_CLIENT_SECRET,
      `${this.URI}/user/callback`
    );
  }

  async urlAuth(){
    const oauthClient = await this.oauthClient()
    return oauthClient.generateAuthUrl({
      access_type: "offline",
      scope:[
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/drive"
      ],
    });
  }

  async getTokenAndInfoUser(code:string){
    const oauthClient = await this.oauthClient()
    //get token
    const { tokens } = await oauthClient.getToken(code);    
    await oauthClient.setCredentials(tokens);
    //get data user

    const options = {
      method: 'GET',
      url: 'https://www.googleapis.com/oauth2/v3/userinfo',//userinfo.profile
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    };
    const { data } = await axios(options);
    return {tokens, data}
  }

  async refreshToken(data){
    try {
      
      const user = await this.userModel.findOne({idUserG:data.id}).select('+token +RToken');

      const token =  JSON.parse(this.encriptionService.decryptToken(user.token));
      const RToken =  JSON.parse(this.encriptionService.decryptToken(user.RToken));
      const seconds = Date.now();

      let newToken = token;

      if(seconds <= token.expiry_date){
        const { data } = await axios.post(
          'https://oauth2.googleapis.com/token',
          null,
          {
            params: {
              client_id: this.GOOGLE_CLIENT_ID,
              client_secret: this.GOOGLE_CLIENT_SECRET,
              grant_type: 'refresh_token',
              refresh_token: RToken,
            },
          },
        );

        newToken = {
          access_token:data.access_token,
          scope: data.scope,
          token_type: data.token_type,
          id_token: data.id_token,
          expiry_date: token.expiry_date + data.expires_in
        }
        
      }
      const encryptNewToken = this.encriptionService.encriptionToken(JSON.stringify(newToken))
      await this.userModel.updateOne({_id: user._id},{token:encryptNewToken})
    } catch (e) {
      console.log(e);
    }
    
    
  }
}