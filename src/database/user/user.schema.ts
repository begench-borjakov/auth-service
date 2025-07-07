import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { UserRole } from 'src/auth/decorators/roles.decorator'

@Schema({ timestamps: true })
export class User extends Document {
  declare _id: Types.ObjectId

  @Prop({ required: true })
  username: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole

  @Prop()
  refreshToken?: string
}

export const UserSchema = SchemaFactory.createForClass(User)
