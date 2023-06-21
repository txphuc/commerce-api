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
    const exceptionRes = exception.getResponse() as ExceptionRes;
    const errors: ErrorType[] = [];
    if (exceptionRes.message) {
      if (typeof exceptionRes.message === 'string') {
        errors.push({
          message: exceptionRes.message,
        });
      } else {
        const messages = exceptionRes.message as ValidationError[];
        try {
          errors.push(
            ...messages.reduce((arr, { constraints, target, property }) => {
              Object.keys(constraints).forEach((constraint) => {
                const code = indexError[constraint];

                arr.push({
                  resource: (target.constructor as unknown as TargetConstructor).resource,
                  field: property,
                  code,
                  message: data[code],
                });
              });
              return arr;
            }, []),
          );
        } catch (err) {
          const messages = exceptionRes.message as ErrorType[];
          messages.forEach(({ resource, field, code }) =>
            errors.push({
              resource,
              field,
              code,
              message: data[code],
            }),
          );
        }
      }
    } else {
      const { resource, field, code } = exception.getResponse() as ErrorType;

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
    this.logger.log(JSON.stringify(errors));
  }
}
