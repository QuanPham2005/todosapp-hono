import { Client } from 'pg';
declare const client: Client;
/** Ensures a single Postgres connection (Workers-compatible; avoids pg Pool timer.unref). */
export declare function connectDb(): Promise<void>;
export declare const db: import("drizzle-orm/node-postgres").NodePgDatabase<Record<string, never>>;
export { client };
//# sourceMappingURL=client.d.ts.map