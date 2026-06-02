import { useEffect, useMemo, useState } from 'react';
import type { AuthUser, TodoItem, TodoPayload, TodoUpdatePayload } from '../types';
import { createTodo, deleteTodo, fetchTodos, updateTodo } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { formatDate } from '../utils';

interface UserDashboardProps {
  currentUser: AuthUser;
  onLogout: () => void;
}

export function UserDashboard({ currentUser, onLogout }: UserDashboardProps) {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [tags, setTags] = useState('');

  const loadTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const { todos } = await fetchTodos();
      setTodos(todos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải todo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    try {
      const payload: TodoPayload = {
        title,
        description,
        dueDate: dueDate || undefined,
        priority,
        tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      };
      const { todo } = await createTodo(payload);
      setTodos((current) => [todo, ...current]);
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('Low');
      setTags('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tạo todo.');
    }
  };

  const handleToggleComplete = async (todo: TodoItem) => {
    try {
      const payload: TodoUpdatePayload = { completed: !todo.completed };
      const { todo: updated } = await updateTodo(todo.id, payload);
      setTodos((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể cập nhật todo.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xóa todo.');
    }
  };

  const summary = useMemo(
    () => ({
      total: todos.length,
      completed: todos.filter((item) => item.completed).length,
      pending: todos.filter((item) => !item.completed).length,
    }),
    [todos]
  );

  return (
    <div className="space-y-8 px-4 py-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-sky-600">Dashboard</p>
          <h1 className="text-3xl font-semibold text-slate-900">Xin chào, {currentUser.email}</h1>
          <p className="mt-2 text-slate-600">Quản lý công việc cá nhân của bạn ở đây.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={loadTodos}>Làm mới</Button>
          <Button variant="outline" onClick={onLogout}>Đăng xuất</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Tổng todo</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{summary.total}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Đã hoàn thành</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{summary.completed}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Còn lại</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{summary.pending}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold text-slate-900">Tạo Todo mới</h2>
        <form className="mt-6 grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit}>
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Tiêu đề</label>
            <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Học React" required />
          </div>
          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Mô tả</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-[108px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
              placeholder="Mô tả chi tiết cho todo"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Due Date</label>
            <Input value={dueDate} onChange={(event) => setDueDate(event.target.value)} type="date" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Priority</label>
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value as 'Low' | 'Medium' | 'High')}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Tags</label>
            <Input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="việc nhà, học tập" />
          </div>
          <div className="lg:col-span-2">
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <Button type="submit" className="w-full">
              Tạo Todo
            </Button>
          </div>
        </form>
      </Card>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-slate-900">Danh sách Todo</h2>
          <p className="text-sm text-slate-500">{todos.length} mục</p>
        </div>

        {loading ? (
          <p className="text-slate-600">Đang tải...</p>
        ) : todos.length === 0 ? (
          <p className="text-slate-600">Chưa có todo nào. Hãy tạo một todo mới.</p>
        ) : (
          <div className="grid gap-4">
            {todos.map((todo) => (
              <Card key={todo.id} className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{todo.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{todo.description || 'Không có mô tả'}</p>
                  </div>
                  <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                    {todo.priority}
                  </div>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <p className="text-sm text-slate-600">Due: {formatDate(todo.dueDate)}</p>
                  <p className="text-sm text-slate-600">Tags: {(todo.tags ?? []).length > 0 ? todo.tags!.join(', ') : 'Không'}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant={todo.completed ? 'secondary' : 'primary'} onClick={() => handleToggleComplete(todo)}>
                    {todo.completed ? 'Đánh dấu chưa xong' : 'Đã hoàn thành'}
                  </Button>
                  <Button variant="outline" onClick={() => handleDelete(todo.id)}>
                    Xóa
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
