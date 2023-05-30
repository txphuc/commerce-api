import { makeDataSourceOptions } from './data-source';

export default () => ({
  host: process.env.HOST ?? 'localhost',
  port: parseInt(process.env.PORT, 10) || 3000,
  database: makeDataSourceOptions(),
  jwt: {
    secret: process.env.JWT_SECRET ?? 'default-secret',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '12h',
  },
  google: {
    authClientId: process.env.GOOGLE_AUTH_CLIENT_ID,
    authClientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
  },
});
