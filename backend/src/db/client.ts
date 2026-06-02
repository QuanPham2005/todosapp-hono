import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:Abc123456@127.0.0.1:5432/tododb';

const pool = new Pool({
  connectionString,
  max: 5,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

/** Verifies database reachability before handling API requests. */
export async function connectDb(): Promise<void> {
  // Warm-up query to fail fast if DB is unreachable and avoid hung requests.
  await pool.query('SELECT 1');
}

pool.on('error', (error) => {
  console.error('[db/client] pool error:', error);
});

export const db = drizzle(pool);
export { pool };
