// src/common/middleware/context.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestContextService } from '../services/request-context.service';


@Injectable()
export class ContextMiddleware implements NestMiddleware {
  constructor(private readonly contextService: RequestContextService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const user = req.user || null; // set by JwtAuthGuard
    this.contextService.run(user, () => next());
  }
}
