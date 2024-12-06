import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema({
  versionKey: false,
  timestamps: {
    createdAt: true,
    updatedAt: false,
  },
})
export class DriveFile{
  @Prop({  })
  fileIdG: string;

  @Prop({  })
  name: string;

  @Prop({  })
  mimetype:string;

  // @Prop({  }) //ver si esto es posibre, y si de ve una img con la url / de no poder ver una img cin url, predefinir un icono para img/docs/pdf
  // url: string;

  //fijarse si se puede optener una imagen de portada de imgs/docs
}
export const DriveFileSchema = SchemaFactory.createForClass(DriveFile);