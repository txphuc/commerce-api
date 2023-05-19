import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import moment from 'moment';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { compare } from 'src/common/utils/bcrypt.util';
import { CurrentUserType } from 'src/common/types/current-user.type';
import { commonError } from 'src/common/errors/constants/common.constant';
import { User } from '../users/entities/user.entity';
import { createErrorType } from 'src/common/types/error.type';
import { authError } from 'src/common/errors/constants/auth.constant';
import { CreateGoogleUserDto } from '../users/dto/create-google-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateActivationKey(): string {
    const randomBytes = crypto.randomBytes(32);
    return randomBytes.toString('hex');
  }

  generateResetToken(): string {
    const randomBytes = crypto.randomBytes(32);
    return randomBytes.toString('hex');
  }

  generateResetTokenExpiration(): Date {
    return moment().add(1, 'hour').toDate();
  }

  async signUp(createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  async validateUser(email: string, password: string): Promise<CurrentUserType> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException(createErrorType(User.name, 'email', commonError.isNotFound));
    }
    if (!user.password) {
      throw new UnauthorizedException(authError.isNoPassword);
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException(authError.isIncorrectPassword);
    }
    const currentUser: CurrentUserType = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
    return currentUser;
  }

  public getCookieWithJwtToken(user: CurrentUserType) {
    const payload = user;
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'jwt.expiresIn',
    )}`;
  }

  async googleSignIn(user: CurrentUserType) {
    console.log(user);
  }

  async googleValidateUser(
    email: string,
    fullName: string,
    avatar: string,
  ): Promise<CurrentUserType> {
    const userByEmail = await this.usersService.findOneByEmail(email);
    if (!userByEmail) {
      const userDto = new CreateGoogleUserDto(email, fullName, avatar);
      const user = await this.usersService.createGoogleUser(userDto);
      const currentUser: CurrentUserType = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };
      return currentUser;
    }
    const currentUser: CurrentUserType = {
      userId: userByEmail.id,
      email: userByEmail.email,
      role: userByEmail.role,
    };
    return currentUser;
  }
}
