import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  versionKey: false,
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
})
export class User{
  @Prop({})
  idUserG: string;

  @Prop({})
  name: string;

  @Prop({})
  email: string;

  @Prop({})
  folderRootM: string;

  @Prop({})
  token: string;

  @Prop({})
  RToken: string;

  @Prop({})
  calendarIdM:string;
}

export const UserSchema = SchemaFactory.createForClass(User);