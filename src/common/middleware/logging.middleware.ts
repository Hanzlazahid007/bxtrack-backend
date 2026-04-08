import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;
      const userId = req.user?.sub ?? 'anonymous';
      const organizationId = req.user?.organizationId ?? 'none';

      const logEntry = {
        method,
        url: originalUrl,
        statusCode,
        duration: `${duration}ms`,
        userId,
        organizationId,
        timestamp: new Date().toISOString(),
      };

      this.logger.log(JSON.stringify(logEntry));
    });

    next();
  }
}
