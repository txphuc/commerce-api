import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TrimStringsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.body) {
      this.trimObjectStrings(req.body);
    }
    if (req.params) {
      this.trimObjectStrings(req.params);
    }
    if (req.query) {
      this.trimObjectStrings(req.query);
    }
    next();
  }

  private trimObjectStrings(obj: any) {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].trim();
      } else if (typeof obj[key] === 'object') {
        this.trimObjectStrings(obj[key]);
      }
    }
  }
}
