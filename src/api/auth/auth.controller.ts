import {
  Body,
  Req,
  Controller,
  Post,
  UseGuards,
  Res,
  Logger,
  Get,
  Query,
  Patch,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import RequestWithUser from './interfaces/request-with-user.interface';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './strategies/public.strategy';
import { SignInDto } from './dto/sign-in.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UserDto } from '../users/dto/user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailDto } from './dto/email.dto';
@ApiTags('Auth')
@Serialize(UserDto)
@Controller('api/v1/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  @Serialize(UserDto)
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
    this.logger.log('Email: ' + signInDto.email);
    const { user } = request;
    const cookie = this.authService.getCookieWithJwtToken(user);
    response.setHeader('Set-Cookie', cookie);
    return response.send(user);
  }

  @Post('sign-out')
  async signOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForSignOut());
    return response.sendStatus(200);
  }

  @Public()
  @Get('confirm-email')
  async confirmEmail(@Query('email') email: string, @Query('activationKey') activationKey: string) {
    return this.authService.confirmEmail(email, activationKey);
  }

  @Public()
  @Post('resend-confirm-email')
  async resendConfirmEmail(@Query() emailDto: EmailDto, @Res() response: Response) {
    await this.authService.resendConfirmEmail(emailDto.email);
    return response.sendStatus(200);
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

  @Public()
  @Patch('/reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Res() response: Response) {
    await this.authService.resetPassword(resetPasswordDto);
    return response.sendStatus(200);
  }

  @Public()
  @Post('request-reset-password')
  async requestResetPassword(@Query() emailDto: EmailDto, @Res() response: Response) {
    await this.authService.requestResetPassword(emailDto.email);
    return response.sendStatus(200);
  }
}
