import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";


@Injectable()
export class EncriptionService {
  private SECRET_KEY : string;
  private IV : string;

  constructor(private readonly configService: ConfigService){
    this.SECRET_KEY = this.configService.get('SECRET_KEY');
    this.IV = this.configService.get('IV');
  }

  encriptionToken (token:string){
    const secret_key =Buffer.from(this.SECRET_KEY, 'base64')
    const iv =Buffer.from(this.IV, 'base64')
    const cipher = createCipheriv('aes-256-cbc', secret_key, iv);
    let encrypted = cipher.update(token, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decryptToken(token:string) {
    const secret_key =Buffer.from(this.SECRET_KEY, 'base64')
    const iv =Buffer.from(this.IV, 'base64')
    const decipher = createDecipheriv('aes-256-cbc', secret_key, iv);
    let decrypted = decipher.update(token, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}