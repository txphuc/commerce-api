import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailsService } from './emails.service';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [EmailsService],
  exports: [EmailsService],
})
export class EmailsModule {}
