import { ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../strategies/public.strategy';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/api/users/users.service';
import { CurrentUserType } from 'src/common/types/current-user.type';
import RequestWithUser from '../interfaces/request-with-user.interface';

@Injectable()
export default class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {
    super(reflector);
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    this.logger.debug('isPublic: ' + isPublic);
    if (isPublic) {
      const request = context.switchToHttp().getRequest() as RequestWithUser;
      const token = request?.cookies?.Authentication;
      if (token) {
        let payload: any;
        try {
          payload = this.jwtService.verify(token);
        } catch (err) {
          return true;
        }
        try {
          const user = await this.usersService.findOneById(payload.userId);

          const currentUser: CurrentUserType = {
            userId: user.id,
            email: user.email,
            role: user.role,
          };
          request.user = currentUser;
        } catch (err) {
          throw new UnauthorizedException();
        }
      }

      return true;
    }
    return super.canActivate(context) as boolean;
  }
}
