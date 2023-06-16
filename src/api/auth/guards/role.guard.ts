import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  mixin,
  Type,
} from '@nestjs/common';
import { Role } from 'src/common/enums/role.enum';
import RequestWithUser from '../interfaces/request-with-user.interface';
import { createErrorType } from 'src/common/types/error.type';
import { User } from 'src/api/users/entities/user.entity';
import { commonError } from 'src/common/errors/constants/common.constant';

const RoleGuard = (role: Role): Type<CanActivate> => {
  @Injectable()
  class RoleGuardMixin implements CanActivate {
    async canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;

      if (user?.role !== role) {
        throw new ForbiddenException(
          createErrorType(User.name, 'role', commonError.forbiddenResource),
        );
      }

      return true;
    }
  }

  return mixin(RoleGuardMixin);
};

export default RoleGuard;
