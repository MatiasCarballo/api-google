import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  versionKey: false,
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
})
export class Event{
  @Prop({})
  eventId:string;

  @Prop({})
  name: string;


}
export const EventSchema = SchemaFactory.createForClass(Event);
