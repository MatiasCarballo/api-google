import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Reflector } from '@nestjs/core';
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate{
  private SECRET_KEY_JWT : string;
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private jwtService:JwtService,
  ){
    this.SECRET_KEY_JWT = this.configService.get('SECRET_KEY_JWT');
  }

  async canActivate (context: ExecutionContext): Promise<boolean>{
    const request = context.getArgByIndex(0);
    
    if(!request.cookies.access_token){
      return false;
    }
    
    const token =request.cookies.access_token
    console.log(token);
    const seconds = Math.floor(Date.now() / 1000);
    const data = await this.jwtService.verifyAsync(token)
    console.log(data);
    
    if (!data || seconds >= data.exp) {
      return false;
    }

    request.dataJwt = data
    return true
  }

}