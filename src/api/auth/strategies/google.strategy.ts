import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get('google.authClientId'),
      clientSecret: configService.get('google.authClientSecret'),
      callbackURL: `http://${configService.get('host')}:5000/api/v1/auth/google/redirect`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const email: string = emails[0].value;
    const fullName = `${name.familyName} ${name.givenName}`;
    const avatar: string = photos[0].value;
    const user = await this.authService.googleValidateUser(email, fullName, avatar);
    done(null, user);
  }
}
