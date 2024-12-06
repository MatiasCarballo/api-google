import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { UtilsModule } from '../Utils/utils.module';
import { DriveService } from './drive.service';
import { DriveController } from './dirve.controller';
import { DriveFolder, DriveFolderSchema } from './driveFolder.schema';
import { JwtModule } from '@nestjs/jwt';
import { DriveFile, DriveFileSchema } from './driveFile.schema';

@Module({
  imports:[ 
    UtilsModule,
    ConfigModule.forRoot(),
    HttpModule,
    MongooseModule.forFeature(
      [
        {
          name: DriveFolder.name,
          schema: DriveFolderSchema,
        },
        {
          name: DriveFile.name,
          schema: DriveFileSchema,
        },
      ],
    ),
    JwtModule.register({
      secret:process.env.SECRET_KEY_JWT,
      signOptions: {expiresIn: '7d'},
    })
  ],
  controllers:[DriveController],
  providers: [DriveService],
  exports: [DriveService],
})
export class DriveModule{}