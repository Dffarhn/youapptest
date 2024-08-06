import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class FilterFieldsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    // Define the fields you want to allow in the request body
    const allowedFields = ['displayname', 'gender', 'birthday', 'height', 'weight'];

    // Filter the request body to only include allowed fields
    req.body = Object.keys(req.body)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    next();
  }
}
