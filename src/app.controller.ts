import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './api/auth/strategies/public.strategy';

@Controller()
@ApiTags('App')
export class AppController {
  constructor(private appService: AppService) {}

  @Public()
  @Get('health-check')
  healthCheck(): string {
    return this.appService.healthCheck();
  }
}
