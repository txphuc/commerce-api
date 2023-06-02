import { makeDataSourceOptions } from './data-source';

export default () => ({
  host: process.env.HOST ?? 'localhost',
  port: parseInt(process.env.PORT, 10) || 3000,
  database: makeDataSourceOptions(),
  jwt: {
    secret: process.env.JWT_SECRET ?? 'default-secret',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '12h',
  },
  email: {
    host: process.env.EMAIL_HOST ?? 'smtp.gmail.com',
    port: process.env.EMAIL_PORT ?? 587,
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    confirmationUrl: process.env.EMAIL_CONFIRMATION_URL,
  },
  google: {
    authClientId: process.env.GOOGLE_AUTH_CLIENT_ID,
    authClientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
  },
});
