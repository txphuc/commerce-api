import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  Logger,
  NotFoundException,
  UnauthorizedException,
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

@Catch(NotFoundException, UnauthorizedException, ForbiddenException)
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  catch(
    exception: NotFoundException | UnauthorizedException | ForbiddenException,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionRes = exception.getResponse() as ExceptionRes | ErrorType;
    const { resource, field, code, message } = exceptionRes as ErrorType;
    this.logger.log(JSON.stringify(exceptionRes));
    const error = {
      resource,
      field,
      code,
      message: data[code] ?? message,
    };

    response.status(status).json({
      success: false,
      error,
    });
    this.logger.log(JSON.stringify(error));
  }
}
