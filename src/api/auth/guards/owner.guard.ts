import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import RequestWithUser from '../interfaces/request-with-user.interface';
import { createErrorType } from 'src/common/types/error.type';
import { User } from 'src/api/users/entities/user.entity';
import { commonError } from 'src/common/errors/constants/common.constant';
import { Role } from 'src/common/enums/role.enum';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../strategies/public.strategy';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const { user, params, route } = request;
    const resourceId = params.id;
    if (user.role === Role.Admin) {
      return true;
    }
    if (route.path.includes('users/:id')) {
      const isOwner = user.userId.toString() === resourceId;
      if (!isOwner) {
        throw new ForbiddenException(
          createErrorType(User.name, 'role', commonError.forbiddenResource),
        );
      }
    }

    return true;
  }
}
