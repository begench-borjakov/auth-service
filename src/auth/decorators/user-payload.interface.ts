import { UserRole } from './roles.decorator'

export interface UserPayload {
  sub: string
  email: string
  role: UserRole
}
