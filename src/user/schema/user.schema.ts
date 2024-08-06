import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.password;
      return ret;
    },
  },
})

  
export class User extends Document {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  displayname: string;

  @Prop({ enum: ["male", 'female'] })
  gender: string;

  @Prop()
  birthday: string;

  @Prop()
  height: string;

  @Prop()
  weight: string;

  @Prop()
  horoscope: string;

  @Prop()
  zodiac: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
