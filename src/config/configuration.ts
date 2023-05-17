import { makeDataSourceOptions } from './data-source';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: makeDataSourceOptions(),
  jwt: {
    secret: process.env.JWT_SECRET ?? 'default-secret',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '3600s',
  },
});
