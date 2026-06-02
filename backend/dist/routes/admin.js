import { Hono } from 'hono';
import { db } from '../db/client';
import { users, todos } from '../db/schema';
import { count, eq } from 'drizzle-orm';
import { verifyAuth, requireAdmin } from '../middlewares/auth';
const adminRoutes = new Hono();
adminRoutes.use('*', verifyAuth, requireAdmin);
adminRoutes.get('/stats', async (c) => {
    try {
        const [{ value: usersCount }] = await db.select({ value: count() }).from(users);
        const [{ value: todosCount }] = await db.select({ value: count() }).from(todos);
        return c.json({ users: Number(usersCount), todos: Number(todosCount) });
    }
    catch (error) {
        console.error('Admin stats error:', error);
        return c.json({ error: 'Không thể lấy thống kê admin.' }, 500);
    }
});
adminRoutes.get('/users', async (c) => {
    const userRows = await db
        .select({
        id: users.id,
        email: users.email,
        role: users.role,
        isBanned: users.isBanned,
        createdAt: users.createdAt,
    })
        .from(users)
        .orderBy(users.createdAt);
    return c.json({ users: userRows });
});
adminRoutes.patch('/users/:id/ban', async (c) => {
    const id = Number(c.req.param('id'));
    const [updatedUser] = await db
        .update(users)
        .set({ isBanned: true })
        .where(eq(users.id, id))
        .returning({ id: users.id, email: users.email, role: users.role, isBanned: users.isBanned });
    if (!updatedUser) {
        return c.json({ error: 'User không tồn tại.' }, 404);
    }
    return c.json({ user: updatedUser });
});
adminRoutes.patch('/users/:id/unban', async (c) => {
    const id = Number(c.req.param('id'));
    const [updatedUser] = await db
        .update(users)
        .set({ isBanned: false })
        .where(eq(users.id, id))
        .returning({ id: users.id, email: users.email, role: users.role, isBanned: users.isBanned });
    if (!updatedUser) {
        return c.json({ error: 'User không tồn tại.' }, 404);
    }
    return c.json({ user: updatedUser });
});
export default adminRoutes;
//# sourceMappingURL=admin.js.map