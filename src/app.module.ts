import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { generateModuleSet } from './modules-set.util';
import { APP_GUARD } from '@nestjs/core';
import JwtAuthGuard from './api/auth/guards/jwt-auth.guard';
import LogsMiddleware from './middlewares/logger.middleware';
import { TrimStringsMiddleware } from './middlewares/trim-strings.middleware';
import { OwnerGuard } from './api/auth/guards/owner.guard';

@Module({
  imports: generateModuleSet(),
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: OwnerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*').apply(TrimStringsMiddleware).forRoutes('*');
  }
}
