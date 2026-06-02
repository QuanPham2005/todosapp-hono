import bcrypt from 'bcryptjs';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://postgres:Abc123456@127.0.0.1:5432/tododb',
});

const adminEmail = 'admin@todoapp.local';
const adminPassword = 'Admin123!';
const adminRole = 'ADMIN';

const client = await pool.connect();

try {
  const { rows } = await client.query('SELECT id, email, role FROM users WHERE email = $1', [adminEmail]);

  if (rows.length > 0) {
    console.log('Admin user already exists:');
    console.log(JSON.stringify(rows[0], null, 2));
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const result = await client.query(
    'INSERT INTO users (email, password_hash, role, is_banned) VALUES ($1, $2, $3, false) RETURNING id, email, role',
    [adminEmail, passwordHash, adminRole]
  );

  console.log('Admin user created successfully:');
  console.log(JSON.stringify(result.rows[0], null, 2));
  console.log(`Login with email=${adminEmail} password=${adminPassword}`);
} catch (error) {
  console.error('Error creating admin user:', error);
  process.exit(1);
} finally {
  client.release();
  await pool.end();
}
