import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import moment from 'moment';
// import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import TokenPayload from './interfaces/token-payload.interface';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

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

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    console.log(JSON.stringify(user));
    console.log(bcrypt.compareSync(password, user.password));
    if (!user || !user.password || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException();
    }
    user.password = undefined;
    return user;
  }

  public getCookieWithJwtToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }
}
