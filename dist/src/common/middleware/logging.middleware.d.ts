import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}
export declare class LoggingMiddleware implements NestMiddleware {
    private readonly logger;
    use(req: AuthenticatedRequest, res: Response, next: NextFunction): void;
}
export {};
