import { Pool } from 'pg';
import { dbConfig } from '../../config';

export const pgPool = new Pool({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.user,
  password: dbConfig.password,
  max: dbConfig.max,
  idleTimeoutMillis: dbConfig.idleTimeoutMillis,
  connectionTimeoutMillis: dbConfig.connectionTimeoutMillis,
});

// Optional: basic lifecycle logging
// pgPool.on('connect', () => {
//   console.log('[DB] PostgreSQL connected');
// });

// pgPool.on('error', (err) => {
//   console.error('[DB] PostgreSQL pool error', err);
// });
