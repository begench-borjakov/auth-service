import { SetMetadata } from '@nestjs/common'

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
  SUPERADMIN = 'superadmin',
}

export const ROLES_KEY = Symbol('ROLES')
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles)
