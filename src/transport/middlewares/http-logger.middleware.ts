import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../infra/logger';

export function createHttpLoggerMiddleware(logger: Logger) {
  return function httpLoggerMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const start = process.hrtime.bigint();

    res.on('finish', () => {
      const durationNs = process.hrtime.bigint() - start;
      const durationMs = Number(durationNs) / 1_000_000;

      logger.info('http_request', {
        requestId: req.requestId,
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs: Math.round(durationMs),
        ...(req.user && { userId: req.user.userId }),
      });
    });
    next();
  };
}
