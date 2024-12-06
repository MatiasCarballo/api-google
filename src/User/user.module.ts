import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { UtilsModule } from '../Utils/utils.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[ 
    UtilsModule,
    ConfigModule.forRoot(),
    HttpModule,
    MongooseModule.forFeature(
      [
        {
          name: User.name,
          schema: UserSchema,
        },
      ],
    ),
    JwtModule.register({
      secret:process.env.SECRET_KEY_JWT,
      signOptions: {expiresIn: '7d'},
    })
  ],
  controllers:[UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule{}