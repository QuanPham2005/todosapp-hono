import { Pool } from 'pg';
declare const pool: Pool;
/** Verifies database reachability before handling API requests. */
export declare function connectDb(): Promise<void>;
export declare const db: import("drizzle-orm/node-postgres").NodePgDatabase<Record<string, never>>;
export { pool };
//# sourceMappingURL=client.d.ts.map