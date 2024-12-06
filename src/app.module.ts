import { Module } from '@nestjs/common';
import { UserModule } from './User/user.module';
import { MongoModule } from './DataBase/mongo.module';
import { ConfigModule } from '@nestjs/config';
import { UtilsModule } from './Utils/utils.module';
import { DriveModule } from './DriveFile/drive.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongoModule,
    UtilsModule,

    UserModule,
    DriveModule,
  ],
  controllers: []
})
export class AppModule {}
