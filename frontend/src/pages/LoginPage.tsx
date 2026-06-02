import { useState, type FormEvent } from 'react';
import { loginRequest } from '../lib/api';
import type { AuthUser } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface LoginPageProps {
  onSuccess: (user: AuthUser, token: string) => void;
  onGotoRegister: () => void;
}

export function LoginPage({ onSuccess, onGotoRegister }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { user, token } = await loginRequest(email, password);
      onSuccess(user, token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
      <h1 className="text-3xl font-semibold text-slate-900">Đăng nhập</h1>
      <p className="mt-2 text-slate-500">Đăng nhập để quản lý todo của bạn.</p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Mật khẩu</label>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" required minLength={6} />
        </div>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600">
        Chưa có tài khoản?{' '}
        <button type="button" className="font-semibold text-sky-600 hover:text-sky-700" onClick={onGotoRegister}>
          Đăng ký ngay
        </button>
      </div>
    </div>
  );
}
