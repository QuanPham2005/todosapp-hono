import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres:Abc123456@127.0.0.1:5432/tododb';

const client = new Client({ connectionString });

let connectPromise: Promise<void> | null = null;
let isConnected = false;
const CONNECT_TIMEOUT_MS = 5000;

const withTimeout = async <T>(promise: Promise<T>, ms: number, message: string): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(message)), ms);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};

/** Ensures a single Postgres connection (Workers-compatible; avoids pg Pool timer.unref). */
export async function connectDb(): Promise<void> {
  if (isConnected) return;
  if (!connectPromise) {
    connectPromise = client
      .connect()
      .then(() => {
        isConnected = true;
      })
      .catch((error) => {
        isConnected = false;
        connectPromise = null;
        console.error('[db/client] connect error:', error);
        throw error;
      });
  }
  await withTimeout(
    connectPromise,
    CONNECT_TIMEOUT_MS,
    '[db/client] connect timeout after 5s'
  );
}

client.on('error', (error) => {
  // Do not force reconnection here: reconnecting a pg Client in Workers can deadlock requests.
  console.error('[db/client] client error (non-fatal log):', error);
});

export const db = drizzle(client);
export { client };
