import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

@Schema({ timestamps: true })
export class Role extends Document {
  declare _id: Types.ObjectId

  @Prop({ required: true, unique: true })
  name: string

  @Prop({ type: [String], default: [] })
  permissions: string[]

  @Prop()
  description?: string
}

export const RoleSchema = SchemaFactory.createForClass(Role)
