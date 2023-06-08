# e-commerce-api

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Environment

src/.env

```.env
# App
PORT=example
NODE_ENV=example

# Database
POSTGRES_HOST=example
POSTGRES_PORT=example
POSTGRES_USER=example
POSTGRES_PASSWORD=example
POSTGRES_DB=example

# JWT
JWT_SECRET=example
JWT_EXPIRES_IN=example

# Email
EMAIL_HOST=example
EMAIL_PORT=example
EMAIL_USERNAME=example
EMAIL_PASSWORD=example
EMAIL_CONFIRMATION_URL=example

# Google
GOOGLE_AUTH_CLIENT_ID=example
GOOGLE_AUTH_CLIENT_SECRET=example
```

## Installation

```bash
# install dependencies
yarn install

# create postgres DB (if not exists)
docker compose up -d

# migrate database structure

yarn run migration:up
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## NestJS helpful commands

```bash
# create new module:
nest g module module_name

# migration-generate from entity (result can be found in src/migrations):

NAME=name_of_migration_file yarn run migration:generate
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

## Stay in touch

[Tran Xuan Phuc](https://github.com/txphuc/)

## License

Nest is [MIT licensed](LICENSE).
