import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class PostsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (true) {
      next();
    } else {
      throw new BadRequestException('Bad request');
    }
  }
}
