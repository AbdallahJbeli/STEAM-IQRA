import pkg from 'pg';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } from './env.js';
const { Pool } = pkg;

const pool = new Pool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  // ssl: process.env.NODE_ENV === 'production',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected pool error:', err);
  process.exit(-1);
});

process.on('SIGTERM', async () => {
  await pool.end();
  console.log('Database pool closed');
});

export default pool;