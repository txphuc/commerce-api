import { Body, Req, Controller, HttpCode, Post, UseGuards, Res, Logger } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import RequestWithUser from './interfaces/request-with-user.interface';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './strategies/public.strategy';
import { SignInDto } from './dto/sign-in.dto';
@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @HttpCode(200)
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(
    @Req() request: RequestWithUser,
    @Res() response: Response,
    @Body() signInDto: SignInDto,
  ) {
    this.logger.debug(signInDto.email);
    const { user } = request;
    const cookie = this.authService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    user.password = undefined;
    return response.send(user);
  }
}
