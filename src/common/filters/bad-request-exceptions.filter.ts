import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  Logger,
  ValidationError,
} from '@nestjs/common';
import { Response } from 'express';

import { indexError } from '../errors/constants/index.constant';
import data from '../errors/data';
import { ErrorType } from '../types/error.type';

type Constraint = {
  constraint: string;
  property: string;
};

type ExceptionRes = {
  message: Constraint[];
};

type TargetConstructor = {
  resource: string;
};

@Catch(BadRequestException)
export class BadRequestExceptionsFilter implements ExceptionFilter<BadRequestException> {
  private readonly logger = new Logger(BadRequestExceptionsFilter.name);
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionRes = exception.getResponse() as ExceptionRes | ErrorType;
    const errors: ErrorType[] = [];
    this.logger.error(exceptionRes);

    if (exceptionRes.message) {
      if (typeof exceptionRes.message === 'string') {
        errors.push({
          message: exceptionRes.message,
        });
      } else {
        const messages = exceptionRes.message as ValidationError[];

        errors.push(
          ...messages.reduce((arr, { constraints, target, property }) => {
            const code = indexError[`${Object.keys(constraints)[0]}`];

            arr.push({
              resource: (target.constructor as unknown as TargetConstructor).resource,
              field: property,
              code,
              message: data[code],
            });

            return arr;
          }, []),
        );
      }
    } else {
      const { resource, field, code } = exceptionRes as ErrorType;

      errors.push({
        resource,
        field,
        code,
        message: data[code],
      });
    }

    response.status(status).json({
      success: false,
      errors,
    });
  }
}
