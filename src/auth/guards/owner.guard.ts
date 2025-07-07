import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const user = request.user
    const paramId = request.params.id

    if (!user || !paramId) {
      throw new ForbiddenException('Missing authentication or resource identifier')
    }

    if (String(user.sub) !== String(paramId)) {
      throw new ForbiddenException('You can only access your own data')
    }

    return true
  }
}
