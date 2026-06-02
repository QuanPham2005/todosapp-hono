import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
const connectionString = process.env.DATABASE_URL ||
    'postgresql://postgres:Abc123456@127.0.0.1:5432/tododb';
const client = new Client({ connectionString });
let connectPromise = null;
/** Ensures a single Postgres connection (Workers-compatible; avoids pg Pool timer.unref). */
export async function connectDb() {
    if (!connectPromise) {
        connectPromise = client
            .connect()
            .then(() => undefined)
            .catch((error) => {
            connectPromise = null;
            console.error('[db/client] connect error:', error);
            throw error;
        });
    }
    await connectPromise;
}
client.on('error', (error) => {
    console.error('[db/client] client error:', error);
    connectPromise = null;
});
export const db = drizzle(client);
export { client };
//# sourceMappingURL=client.js.map