import { useEffect, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { AuthUser, AdminUser, StatsData } from '../types';
import { banUser, fetchStats, fetchUsers, unbanUser } from '../lib/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

interface AdminDashboardProps {
  currentUser: AuthUser;
  onLogout: () => void;
}

export function AdminDashboard({ currentUser, onLogout }: AdminDashboardProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, usersData] = await Promise.all([fetchStats(), fetchUsers()]);
      setStats(statsData);
      setUsers(usersData.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu quản trị.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBan = async (id: number) => {
    try {
      await banUser(id);
      setUsers((current) => current.map((user) => (user.id === id ? { ...user, isBanned: true } : user)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể khóa user.');
    }
  };

  const handleUnban = async (id: number) => {
    try {
      await unbanUser(id);
      setUsers((current) => current.map((user) => (user.id === id ? { ...user, isBanned: false } : user)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể mở khóa user.');
    }
  };

  const chartData = stats
    ? [
        { name: 'Users', value: stats.users },
        { name: 'Todos', value: stats.todos },
      ]
    : [];

  return (
    <div className="space-y-8 px-4 py-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-sky-600">Admin Dashboard</p>
          <h1 className="text-3xl font-semibold text-slate-900">Chào Admin {currentUser.email}</h1>
          <p className="mt-2 text-slate-600">Quản lý user, thống kê và ban/unban tài khoản.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={loadData}>Làm mới</Button>
          <Button variant="outline" onClick={onLogout}>Đăng xuất</Button>
        </div>
      </div>

      {error ? <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <p className="text-sm text-slate-500">Tổng user</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{stats?.users ?? '---'}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Tổng todo</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{stats?.todos ?? '---'}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Trạng thái</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{loading ? 'Đang tải...' : 'Sẵn sàng'}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold text-slate-900">Biểu đồ thống kê</h2>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 16, right: 16, bottom: 16, left: 0 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-slate-900">Danh sách user</h2>
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
          <table className="w-full border-collapse bg-white text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-slate-200 hover:bg-slate-50">
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3">{user.isBanned ? 'Banned' : 'Active'}</td>
                  <td className="px-4 py-3">
                    {user.isBanned ? (
                      <Button variant="secondary" onClick={() => handleUnban(user.id)}>
                        Unban
                      </Button>
                    ) : (
                      <Button variant="danger" onClick={() => handleBan(user.id)}>
                        Ban
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
