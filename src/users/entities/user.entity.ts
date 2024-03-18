import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CallbackWithoutResultAndOptionalError, Document } from 'mongoose';
import { AuthelpersService } from '@mmm/authelpers';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true,select:false })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre(
  'save',
  async function (next: CallbackWithoutResultAndOptionalError) {
    try {
      if (!this.isModified('password')) {
        next();
      } else {
        const helper = new AuthelpersService();
        this.password = await helper.hashPassword(this.password);
        next();
      }
    } catch (error) {
      next(error);
    }
  },
);
