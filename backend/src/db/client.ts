import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

export type DbEnv = {
  DATABASE_URL?: string;
};

const DEFAULT_DATABASE_URL = 'postgresql://postgres:Abc123456@127.0.0.1:5432/tododb';

function getConnectionString(env?: DbEnv): string {
  return env?.DATABASE_URL || process.env.DATABASE_URL || DEFAULT_DATABASE_URL;
}

export function getNeonClient(env?: DbEnv) {
  const connectionString = getConnectionString(env);
  return neon(connectionString) as any;
}

export function getDb(env?: DbEnv) {
  return drizzle(getNeonClient(env)) as any;
}

export async function connectDb(env?: DbEnv): Promise<void> {
  const sql = getNeonClient(env);
  await sql.query('SELECT 1');
}

export const db = getDb();
export const pool = {
  end: async () => Promise.resolve(),
  on: () => undefined,
} as any;