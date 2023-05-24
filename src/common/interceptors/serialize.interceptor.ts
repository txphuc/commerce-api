import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ClassConstructor {
  new (...args: any[]): object;
}

const skipSerialize = Symbol('SkipSerialize');

export function SkipSerialize() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.value[skipSerialize] = true;
  };
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(_context: ExecutionContext, handler: CallHandler): Observable<any> {
    const isIgnored = _context.getHandler()[skipSerialize];
    if (isIgnored) {
      return handler.handle();
    }
    return handler.handle().pipe(
      map((data: any) => {
        if (data) {
          if (data.meta) {
            return {
              success: true,
              data: plainToInstance(this.dto, data.data, {
                excludeExtraneousValues: true,
              }),
              meta: data.meta,
            };
          } else {
            return {
              success: true,
              data: plainToInstance(this.dto, data, {
                excludeExtraneousValues: true,
              }),
            };
          }
        } else {
          return {
            success: true,
          };
        }
      }),
    );
  }
}
