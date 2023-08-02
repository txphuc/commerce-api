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
import { toHiddenString } from '../utils/string.util';
import regex from '../errors/data/regex';

type Constraint = {
  constraint: string;
  property: string;
  value: any;
  children: Constraint[];
};

type ExceptionRes = {
  message: Constraint[];
};

type TargetConstructor = {
  resource: string;
};

const minMaxConstraints = ['min', 'max'];
const minMaxlengthConstraints = ['minLength', 'maxLength'];
const matchesConstraint = 'matches';
const hiddenFields = ['password'];
@Catch(BadRequestException)
export class BadRequestExceptionsFilter implements ExceptionFilter<BadRequestException> {
  private readonly logger = new Logger(BadRequestExceptionsFilter.name);
  private validateNestedExceptions(messages: ValidationError[], errors: ErrorType[]) {
    for (const { constraints, target, property, value, children } of messages) {
      if (constraints) {
        const constraint = Object.keys(constraints)[0];
        const code = indexError[constraint];

        const getMessage = () => {
          let constraintValue = null;
          if (minMaxConstraints.includes(constraint)) {
            constraintValue = constraints[constraint].slice(-1);
          }
          if (minMaxlengthConstraints.includes(constraint)) {
            constraintValue = constraints[constraint].slice(-2);
          }
          if (constraint === matchesConstraint) {
            constraintValue = regex[property];
          }
          if (constraintValue) {
            return data[code] + constraintValue;
          }
          return data[code];
        };
        const valueForShow = value === undefined ? null : value;

        errors.push({
          resource: (target.constructor as unknown as TargetConstructor).resource,
          field: property,
          code,
          value: hiddenFields.includes(property) ? toHiddenString(valueForShow) : valueForShow,
          message: getMessage(),
        });
      }
      if (children?.length > 0) {
        this.validateNestedExceptions(children as ValidationError[], errors);
      }
    }
  }

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
        this.validateNestedExceptions(messages, errors);
        if (errors.length === 0) {
          const customMessages = exceptionRes.message as ErrorType[];
          customMessages.forEach((message) => {
            const { resource, field, code, value } = message;
            errors.push({
              resource,
              field,
              code,
              value: value === undefined ? null : value,
              message: data[code],
            });
          });
        }
      }
    } else {
      const { resource, field, code, value } = exception.getResponse() as ErrorType;

      errors.push({
        resource,
        field,
        code,
        value: value === undefined ? null : value,
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
