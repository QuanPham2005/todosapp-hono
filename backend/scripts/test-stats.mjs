process.env.DATABASE_URL = 'postgresql://postgres:Abc123456@localhost:5432/tododb';
import { db } from '../dist/db/client.js';
import { users, todos } from '../dist/db/schema.js';
import { sql } from 'drizzle-orm';

try {
  console.log('check users count query...');
  const [userCountResult] = await db.select({ count: sql`count(*)` }).from(users);
  console.log('userCountResult', userCountResult);
} catch (err) {
  console.error('users count error', err);
}

try {
  console.log('check todos count query...');
  const [todoCountResult] = await db.select({ count: sql`count(*)` }).from(todos);
  console.log('todoCountResult', todoCountResult);
} catch (err) {
  console.error('todos count error', err);
}
