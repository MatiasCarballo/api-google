import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { DriveFile } from "./driveFile.schema";
import { SchemaTypes } from "mongoose";


@Schema({
  versionKey: false,
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
})
export class DriveFolder{
  @Prop({})
  FolderIdG: string;

  @Prop({})
  name: string;

  //folders hijo (Mongo)/ si no tiene es madre 
  @Prop({})
  FolderIdsM: string[];

  @Prop({
    type:[{ type: SchemaTypes.ObjectId, ref: 'DriveFile' }],
    default: []
  })
  FilesIdsM:DriveFile[];
}
export const DriveFolderSchema = SchemaFactory.createForClass(DriveFolder);