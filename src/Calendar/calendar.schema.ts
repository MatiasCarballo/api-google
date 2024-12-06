import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Event } from './event.schema';

@Schema({
  versionKey: false,
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
})
export class Calendar{
  @Prop({})
  name: string;

  @Prop({})
  calendarIdG: string;

  @Prop({})
  avents: Event[];
}
export const CalendarSchema = SchemaFactory.createForClass(Calendar);