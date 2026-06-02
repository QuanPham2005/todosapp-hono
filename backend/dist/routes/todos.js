import { Hono } from 'hono';
import { db } from '../db/client';
import { todos, tags as todoTags } from '../db/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { verifyAuth } from '../middlewares/auth';
const todoRoutes = new Hono();
todoRoutes.use('*', verifyAuth);
todoRoutes.get('/', async (c) => {
    const user = c.get('user');
    const todoList = (await db.select().from(todos).where(eq(todos.userId, user.id)));
    const todoIds = todoList.map((todo) => todo.id);
    const tagRows = todoIds.length > 0
        ? (await db.select().from(todoTags).where(inArray(todoTags.todoId, todoIds)))
        : [];
    const todosWithTags = todoList.map((todo) => ({
        ...todo,
        tags: tagRows.filter((tag) => tag.todoId === todo.id).map((tag) => tag.name),
    }));
    return c.json({ todos: todosWithTags });
});
todoRoutes.post('/', async (c) => {
    const user = c.get('user');
    let body;
    try {
        const rawBody = await c.req.text();
        body = rawBody ? JSON.parse(rawBody) : {};
    }
    catch (error) {
        console.error('[todos] POST parse error:', error);
        return c.json({ error: 'Invalid JSON body.' }, 400);
    }
    const title = String(body.title ?? '').trim();
    if (!title) {
        return c.json({ error: 'Tiêu đề là bắt buộc.' }, 400);
    }
    const tagNames = Array.isArray(body.tags)
        ? body.tags.map((tag) => String(tag).trim()).filter(Boolean)
        : [];
    const [createdTodo] = await db
        .insert(todos)
        .values({
        userId: user.id,
        title,
        description: body.description ? String(body.description) : null,
        dueDate: body.dueDate ? new Date(String(body.dueDate)) : null,
        priority: ['Low', 'Medium', 'High'].includes(String(body.priority))
            ? String(body.priority)
            : 'Low',
        completed: Boolean(body.completed),
    })
        .returning();
    if (tagNames.length > 0) {
        await db.insert(todoTags).values(tagNames.map((name) => ({ todoId: createdTodo.id, name })));
    }
    return c.json({
        todo: {
            ...createdTodo,
            tags: tagNames,
        },
    }, 201);
});
todoRoutes.get('/:id', async (c) => {
    const user = c.get('user');
    const id = Number(c.req.param('id'));
    const [todo] = (await db.select().from(todos).where(and(eq(todos.id, id), eq(todos.userId, user.id))));
    if (!todo) {
        return c.json({ error: 'Todo không tồn tại.' }, 404);
    }
    const tagRows = (await db.select().from(todoTags).where(eq(todoTags.todoId, todo.id)));
    return c.json({
        ...todo,
        tags: tagRows.map((tag) => tag.name),
    });
});
todoRoutes.patch('/:id', async (c) => {
    const user = c.get('user');
    const id = Number(c.req.param('id'));
    let body;
    try {
        const rawBody = await c.req.text();
        body = rawBody ? JSON.parse(rawBody) : {};
    }
    catch (error) {
        console.error('[todos] PATCH parse error:', error);
        return c.json({ error: 'Invalid JSON body.' }, 400);
    }
    const updateFields = {};
    if (body.title !== undefined)
        updateFields.title = String(body.title).trim();
    if (body.description !== undefined)
        updateFields.description = String(body.description);
    if (body.dueDate !== undefined)
        updateFields.dueDate = body.dueDate ? new Date(String(body.dueDate)) : null;
    if (body.priority !== undefined)
        updateFields.priority = ['Low', 'Medium', 'High'].includes(String(body.priority)) ? String(body.priority) : 'Low';
    if (body.completed !== undefined)
        updateFields.completed = Boolean(body.completed);
    updateFields.updatedAt = new Date();
    let updatedTodo;
    try {
        [updatedTodo] = await db
            .update(todos)
            .set(updateFields)
            .where(and(eq(todos.id, id), eq(todos.userId, user.id)))
            .returning();
    }
    catch (error) {
        console.error('[todos] PATCH update error:', error);
        return c.json({ error: 'Không thể cập nhật todo.' }, 500);
    }
    if (!updatedTodo) {
        return c.json({ error: 'Không thể cập nhật todo.' }, 404);
    }
    if (Array.isArray(body.tags)) {
        await db.delete(todoTags).where(eq(todoTags.todoId, id));
        const tagNames = body.tags.map((tag) => String(tag).trim()).filter(Boolean);
        if (tagNames.length > 0) {
            await db.insert(todoTags).values(tagNames.map((name) => ({ todoId: id, name })));
        }
    }
    const currentTags = await db.select().from(todoTags).where(eq(todoTags.todoId, id));
    return c.json({
        todo: {
            ...updatedTodo,
            tags: currentTags.map((tag) => tag.name),
        },
    });
});
todoRoutes.delete('/:id', async (c) => {
    const user = c.get('user');
    const id = Number(c.req.param('id'));
    await db.delete(todoTags).where(eq(todoTags.todoId, id));
    const deletedRows = await db
        .delete(todos)
        .where(and(eq(todos.id, id), eq(todos.userId, user.id)))
        .returning({ id: todos.id });
    if (deletedRows.length === 0) {
        return c.json({ error: 'Todo không tồn tại hoặc bạn không có quyền.' }, 404);
    }
    return c.json({ success: true });
});
export default todoRoutes;
//# sourceMappingURL=todos.js.map