import { ModuleMetadata } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'src/config/configuration';
import { dataSourceFactory } from 'src/config/data-source';
import { DataSourceOptions } from 'typeorm';
import { ApiModule } from './api/api.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './api/users/users.module';

export function generateModuleSet() {
  const imports: ModuleMetadata['imports'] = [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return config.get('database') as DataSourceOptions;
      },
      dataSourceFactory: dataSourceFactory,
    }),

    ApiModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: configService.get('jwt.expiresIn'),
        },
      }),
    }),

    UsersModule,
  ];

  return imports;
}
