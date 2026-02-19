import { LogContext, Logger } from './logger';

export class ConsoleLogger implements Logger {
  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }
  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }
  error(message: string, context?: LogContext): void {
    this.log('error', message, context);
  }

  private log(
    level: 'info' | 'warn' | 'error',
    message?: string,
    context?: LogContext,
  ) {
    const entry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...context,
    };

    console.log(JSON.stringify(entry));
  }
}
