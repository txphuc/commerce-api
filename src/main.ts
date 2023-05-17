import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { App } from './common/constants/app.constant';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { BadRequestExceptionsFilter } from './common/filters/bad-request-exceptions.filter';
import * as cookieParser from 'cookie-parser';
import { NotFoundExceptionsFilter } from './common/filters/not-found-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  app.useGlobalFilters(new BadRequestExceptionsFilter(), new NotFoundExceptionsFilter());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(configService.get('PORT'));
}
bootstrap();
