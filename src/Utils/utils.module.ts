import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EncriptionService } from './encryption.service';
import { AuthGuard } from './auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { GoogleAuth } from './Services/googleAuth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/User/user.schema';
import { GoogleDrive } from './Services/googleDrive.service';


const SERVICES = [
  AuthGuard,
  EncriptionService,
  GoogleAuth,
  GoogleDrive,
];

@Module({
  imports: [
    ConfigModule.forRoot(), 
    HttpModule,
    JwtModule.register({
      secret:process.env.SECRET_KEY_JWT,
      signOptions: {expiresIn: '7d'},
    }),
    MongooseModule.forFeature(
      [
        {
          name: User.name,
          schema: UserSchema,
        },
      ],
    ),
  ],
  providers: SERVICES,
  exports: SERVICES,
})
export class UtilsModule {}