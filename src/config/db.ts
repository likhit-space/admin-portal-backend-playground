export const dbConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT) || 5432,
  database: process.env.DATABASE_NAME || 'admin_portal_db',
  user: process.env.DATABASE_USER || 'admin_portal',
  password: process.env.DATABASE_PASSWORD || 'admin_portal',
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
};
