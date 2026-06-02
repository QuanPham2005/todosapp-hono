process.env.DATABASE_URL = 'postgresql://postgres:Abc123456@127.0.0.1:5432/tododb';
console.log('process.env.DATABASE_URL=', process.env.DATABASE_URL);
import { db, connectDb } from '../dist/db/client.js';
await connectDb();
console.log('db connected');
import { users, todos } from '../dist/db/schema.js';
import { count } from 'drizzle-orm';

async function run() {
  try {
    console.log('Selecting users...');
    const rows = await db.select({ id: users.id, email: users.email }).from(users).limit(5);
    console.log('sample users:', rows);
  } catch (err) {
    console.error('select users error', err);
  }

  try {
    console.log('Counting users...');
    const [u] = await db.select({ total: count() }).from(users);
    console.log('users count result', u);
  } catch (err) {
    console.error('count users error', err);
  }

  try {
    console.log('Counting todos...');
    const [t] = await db.select({ total: count() }).from(todos);
    console.log('todos count result', t);
  } catch (err) {
    console.error('count todos error', err);
  }

  process.exit(0);
}

await run();
