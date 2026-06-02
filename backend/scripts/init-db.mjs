import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://postgres:Abc123456@127.0.0.1:5432/tododb',
});

const statements = [
  `DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
      CREATE TYPE user_role AS ENUM ('USER', 'ADMIN');
    END IF;
  END$$;`,
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'USER',
    is_banned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITHOUT TIME ZONE,
    priority TEXT NOT NULL DEFAULT 'Low',
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
  )`,
  `CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    todo_id INTEGER NOT NULL REFERENCES todos(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW()
  )`,
];

try {
  for (const stmt of statements) {
    await pool.query(stmt);
  }
  console.log('Schema initialized successfully.');
} catch (error) {
  console.error('Schema initialization failed:', error);
  process.exit(1);
} finally {
  await pool.end();
}
