import pkg from 'pg';
const { Pool } = pkg;

const connectionString = 'postgresql://postgres:Abc123456@127.0.0.1:5432/tododb';
const pool = new Pool({ connectionString });

async function run() {
  try {
    const res = await pool.query('SELECT id, email FROM users LIMIT 5');
    console.log('sample users rows:', res.rows);
  } catch (err) {
    console.error('select users error', err);
  }

  try {
    const r = await pool.query('SELECT COUNT(*)::int AS count FROM users');
    console.log('users count:', r.rows[0]);
  } catch (err) {
    console.error('users count error', err);
  }

  try {
    const r2 = await pool.query('SELECT COUNT(*)::int AS count FROM todos');
    console.log('todos count:', r2.rows[0]);
  } catch (err) {
    console.error('todos count error', err);
  }

  await pool.end();
}

await run();
