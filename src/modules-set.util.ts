import { ModuleMetadata } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'config/configuration';
import { dataSourceFactory } from 'config/data-source';
import { DataSourceOptions } from 'typeorm';

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
  ];

  return imports;
}
