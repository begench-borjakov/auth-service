import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface'
import { UserRole } from 'src/auth/decorators/roles.decorator'
import { Types } from 'mongoose'

interface UserLike {
  _id: Types.ObjectId
  email: string
  role: UserRole
}

export function toJwtPayload(user: UserLike): JwtPayload {
  return {
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  }
}
