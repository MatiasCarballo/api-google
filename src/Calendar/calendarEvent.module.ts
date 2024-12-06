import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { UtilsModule } from "src/Utils/utils.module";
import { CalendarController } from "./calendarEvent.controller";
import { CalendarService } from "./calendarEvent.service";
import { Calendar, CalendarSchema } from "./calendar.schema";
import { Event } from "./event.schema";

@Module({
  imports:[ 
    UtilsModule,
    ConfigModule.forRoot(),
    HttpModule,
    MongooseModule.forFeature(
      [
        {
          name: Calendar.name,
          schema: CalendarSchema,
        },
        {
          name: Event.name,
          schema: CalendarSchema,
        }
      ],
    )
  ],
  controllers:[CalendarController],
  providers: [CalendarService],
  exports: [CalendarService],
})
export class CalendarModule{}