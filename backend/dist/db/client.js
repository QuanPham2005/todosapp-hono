import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
const DEFAULT_DATABASE_URL = 'postgresql://postgres:Abc123456@127.0.0.1:5432/tododb';
function getConnectionString(env) {
    return env?.DATABASE_URL || process.env.DATABASE_URL || DEFAULT_DATABASE_URL;
}
export function getNeonClient(env) {
    const connectionString = getConnectionString(env);
    return neon(connectionString);
}
export function getDb(env) {
    return drizzle(getNeonClient(env));
}
export async function connectDb(env) {
    const sql = getNeonClient(env);
    await sql.query('SELECT 1');
}
export const db = getDb();
export const pool = {
    end: async () => Promise.resolve(),
    on: () => undefined,
};
//# sourceMappingURL=client.js.map