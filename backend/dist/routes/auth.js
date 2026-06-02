import { Hono } from 'hono';
import bcrypt from 'bcryptjs';
import { getDb } from '../db/client';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';
import { createToken } from '../middlewares/auth';
const auth = new Hono();
auth.post('/register', async (c) => {
    const db = getDb(c.env);
    let body;
    try {
        const rawBody = await c.req.text();
        body = rawBody ? JSON.parse(rawBody) : {};
    }
    catch (error) {
        console.error('[auth] POST /register parse error:', error);
        return c.json({ error: 'Invalid JSON body.' }, 400);
    }
    const email = String(body.email ?? '').trim().toLowerCase();
    const password = String(body.password ?? '');
    if (!email || !password || password.length < 6) {
        return c.json({ error: 'Email và password là bắt buộc, password ít nhất 6 ký tự.' }, 400);
    }
    try {
        const existingUser = await db.select().from(users).where(eq(users.email, email));
        if (existingUser.length > 0) {
            return c.json({ error: 'Email đã được sử dụng.' }, 409);
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const [createdUser] = await db
            .insert(users)
            .values({ email, passwordHash, role: 'USER' })
            .returning({ id: users.id, email: users.email, role: users.role });
        const token = createToken({ id: createdUser.id, email: createdUser.email, role: createdUser.role });
        return c.json({ user: createdUser, token }, 201);
    }
    catch (error) {
        console.error('[auth] POST /register error:', error);
        return c.json({ error: 'Không thể đăng ký tài khoản.' }, 500);
    }
});
auth.post('/login', async (c) => {
    const db = getDb(c.env);
    let body;
    try {
        const rawBody = await c.req.text();
        body = rawBody ? JSON.parse(rawBody) : {};
    }
    catch (error) {
        console.error('[auth] POST /login parse error:', error);
        return c.json({ error: 'Invalid JSON body.' }, 400);
    }
    const email = String(body.email ?? '').trim().toLowerCase();
    const password = String(body.password ?? '');
    if (!email || !password) {
        return c.json({ error: 'Email và password là bắt buộc.' }, 400);
    }
    try {
        const [user] = await db.select().from(users).where(eq(users.email, email));
        if (!user) {
            return c.json({ error: 'Email hoặc mật khẩu không đúng.' }, 401);
        }
        if (user.isBanned) {
            return c.json({ error: 'Tài khoản đã bị khóa.' }, 403);
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return c.json({ error: 'Email hoặc mật khẩu không đúng.' }, 401);
        }
        const token = createToken({ id: user.id, email: user.email, role: user.role });
        return c.json({ user: { id: user.id, email: user.email, role: user.role }, token });
    }
    catch (error) {
        console.error('[auth] POST /login error:', error);
        return c.json({ error: 'Không thể đăng nhập.' }, 500);
    }
});
export default auth;
//# sourceMappingURL=auth.js.map