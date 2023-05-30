import { DataSource, DataSourceOptions } from 'typeorm';

export function makeDataSourceOptions(): DataSourceOptions {
  const dataSource: DataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../**/migrations/*{.ts,.js}'],
    logging: false,
    synchronize: process.env.NODE_ENV === 'development' ? false : true,
  };

  return dataSource;
}

export const dataSourceFactory = async (options: DataSourceOptions) => {
  const dataSource = await new DataSource(options).initialize();
  return dataSource;
};
