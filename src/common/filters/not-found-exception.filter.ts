import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorType } from 'src/common/types/error.type';
import data from '../errors/data';

type Constraint = {
  constraint: string;
  property: string;
};

type ExceptionRes = {
  message: Constraint[];
};

@Catch(NotFoundException)
export class NotFoundExceptionsFilter implements ExceptionFilter<BadRequestException> {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionRes = exception.getResponse() as ExceptionRes | ErrorType;
    const errors: ErrorType[] = [];
    const { resource, field, code } = exceptionRes as ErrorType;

    errors.push({
      resource,
      field,
      code,
      message: data[code],
    });

    response.status(status).json({
      success: false,
      errors,
    });
  }
}
