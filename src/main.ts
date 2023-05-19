import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { App } from './common/constants/app.constant';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { BadRequestExceptionsFilter } from './common/filters/bad-request-exceptions.filter';
import * as cookieParser from 'cookie-parser';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { getLogLevels } from './common/utils/logger.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
  });
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle(App.TITLE)
    .setDescription(App.DESCRIPTION)
    .setVersion(App.VERSION)
    .build();

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  );
  app.useGlobalFilters(new BadRequestExceptionsFilter(), new AllExceptionsFilter());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(configService.get('PORT'));
}
bootstrap();
