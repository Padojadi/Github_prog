import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserPermission } from 'src/constants/enum';
import { User } from 'src/modules/user/generated/user';
import { api_code } from 'src/constants/api.codes';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserPermission[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    const permissions = user.accessGroup.permissions as UserPermission[];
    if (!requiredRoles.some((role) => permissions.includes(role))) {
      throw new UnauthorizedException(api_code.MSG_234);
    }

    return true;
  }
}
