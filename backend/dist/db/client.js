import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
const connectionString = process.env.DATABASE_URL ||
    'postgresql://postgres:Abc123456@127.0.0.1:5432/tododb';
const client = new Client({ connectionString });
let connectPromise = null;
let isConnected = false;
/** Ensures a single Postgres connection (Workers-compatible; avoids pg Pool timer.unref). */
export async function connectDb() {
    if (isConnected)
        return;
    if (!connectPromise) {
        connectPromise = client
            .connect()
            .then(() => {
            isConnected = true;
        })
            .catch((error) => {
            // In long-lived worker isolates, pg can throw this on repeated connect attempts.
            // Treat it as a healthy connected state instead of failing every request.
            if (error instanceof Error &&
                error.message.includes('Client has already been connected')) {
                isConnected = true;
                return;
            }
            isConnected = false;
            connectPromise = null;
            console.error('[db/client] connect error:', error);
            throw error;
        });
    }
    await connectPromise;
}
client.on('error', (error) => {
    console.error('[db/client] client error:', error);
    isConnected = false;
    connectPromise = null;
});
export const db = drizzle(client);
export { client };
//# sourceMappingURL=client.js.map