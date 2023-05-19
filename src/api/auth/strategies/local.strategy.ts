import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { CurrentUserType } from 'src/common/types/current-user.type';
import { SignInDto } from '../dto/sign-in.dto';
import { validate as classValidate } from '@nestjs/class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }
  async validate(email: string, password: string): Promise<CurrentUserType> {
    const signInDto = { email, password };
    const errors = await classValidate(plainToClass(SignInDto, signInDto));
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return this.authService.validateUser(email, password);
  }
}
