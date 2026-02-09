export const dbConfig = {
  host: 'localhost',
  port: 5432,
  database: 'admin_portal_api',
  user: 'admin_portal',
  password: 'admin_portal',

  // connection tuning (ค่า default ที่ปลอดภัย)
  max: 10, // max connections
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
};
