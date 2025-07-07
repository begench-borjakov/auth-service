import { Types } from 'mongoose'
import { UserRole } from 'src/auth/decorators/roles.decorator'
export interface IUserBase {
  username: string
  email: string
  password: string
  role: UserRole
  refreshToken?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface IUser extends IUserBase {
  _id: Types.ObjectId
}
