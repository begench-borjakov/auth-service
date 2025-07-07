import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY, UserRole } from '../decorators/roles.decorator'
import { UserPayload } from '../decorators/user-payload.interface'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRoles?.length) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user: UserPayload = request.user

    if (!user?.role) {
      throw new ForbiddenException('User role not found')
    }

    if (requiredRoles.includes(user.role) || user.role === UserRole.SUPERADMIN) {
      return true
    }

    throw new ForbiddenException('Forbidden')
  }
}
