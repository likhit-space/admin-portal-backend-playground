import http from 'http';
import { createApp } from './app';
import { pgPool } from './infra/db/pg-pool';

export function startServer() {
  const app = createApp();

  const server = http.createServer(app);
  const PORT = 3000;

  server.listen(PORT, () => {
    console.log(`[server] listening on port ${PORT}`);
  });

  // ---- graceful shutdown ----
  const shutdown = (signal: string) => {
    console.log(`[server] received ${signal}, shutting down...`);

    server.close(async (err) => {
      console.log('[Server] HTTP server closed');
      try {
        await pgPool.end();
        console.log('[DB] PostgreSQL pool closed');
      } catch (err) {
        console.error('[DB] Error while closing pool', err);
      } finally {
        process.exit(0);
      }
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}
