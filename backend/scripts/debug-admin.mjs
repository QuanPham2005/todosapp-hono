const loginRes = await fetch('http://localhost:8787/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@todoapp.local', password: 'Admin123!' }),
});

const loginBody = await loginRes.text();
console.log('login status', loginRes.status, loginBody);

if (!loginRes.ok) process.exit(1);

const token = JSON.parse(loginBody).token;
const statsRes = await fetch('http://localhost:8787/api/admin/stats', {
  method: 'GET',
  headers: { Authorization: `Bearer ${token}` },
});

const statsBody = await statsRes.text();
console.log('stats status', statsRes.status, statsBody);

const usersRes = await fetch('http://localhost:8787/api/admin/users', {
  method: 'GET',
  headers: { Authorization: `Bearer ${token}` },
});

const usersBody = await usersRes.text();
console.log('users status', usersRes.status, usersBody);
