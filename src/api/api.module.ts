import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EmailsModule } from './emails/emails.module';

@Module({
  imports: [AuthModule, UsersModule, EmailsModule],
})
export class ApiModule {}
