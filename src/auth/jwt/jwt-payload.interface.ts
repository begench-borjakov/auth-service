import { UserRole } from '../decorators/roles.decorator'

export interface JwtPayload {
  sub: string // user id
  email: string
  role: UserRole
}
