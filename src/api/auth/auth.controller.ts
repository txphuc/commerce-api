import { Body, Req, Controller, Post, UseGuards, Res, Logger, Get } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import RequestWithUser from './interfaces/request-with-user.interface';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './strategies/public.strategy';
import { SignInDto } from './dto/sign-in.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
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

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(
    @Body() signInDto: SignInDto,
    @Req() request: RequestWithUser,
    @Res() response: Response,
  ) {
    this.logger.log(signInDto.email);
    const { user } = request;
    const cookie = this.authService.getCookieWithJwtToken(user);
    response.setHeader('Set-Cookie', cookie);
    return response.send(user);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/redirect')
  async googleSignIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;
    const cookie = this.authService.getCookieWithJwtToken(user);
    response.setHeader('Set-Cookie', cookie);
    return response.send(user);
  }
}
