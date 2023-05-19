import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from 'src/api/users/users.service';
import { CurrentUserType } from 'src/common/types/current-user.type';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.get('jwt.secret'),
    });
  }

  async validate(payload: CurrentUserType) {
    try {
      const user = await this.userService.findOneById(payload.userId);

      const currentUser: CurrentUserType = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };
      return currentUser;
    } catch (err) {}
    throw new UnauthorizedException();
  }
}
