import { Request, Response, NextFunction } from 'express';

export function httpLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationNs = process.hrtime.bigint() - start;
    const durationMs = Number(durationNs) / 1_000_000;

    const log = {
      level: 'info',
      type: 'http_request',
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Math.round(durationMs),
      userId: req.user?.userId ?? null,
    };

    console.log(JSON.stringify(log));
  });
  next();
}
