import { useState, type FormEvent } from 'react';
import { registerRequest } from '../lib/api';
import type { AuthUser } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface RegisterPageProps {
  onSuccess: (user: AuthUser, token: string) => void;
  onGotoLogin: () => void;
}

export function RegisterPage({ onSuccess, onGotoLogin }: RegisterPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Mật khẩu và xác nhận phải khớp.');
      return;
    }

    setLoading(true);
    try {
      const { user, token } = await registerRequest(email, password);
      onSuccess(user, token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
      <h1 className="text-3xl font-semibold text-slate-900">Đăng ký</h1>
      <p className="mt-2 text-slate-500">Tạo tài khoản để bắt đầu quản lý todo của bạn.</p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" required />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Mật khẩu</label>
          <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" required minLength={6} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Xác nhận mật khẩu</label>
          <Input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="••••••••" required minLength={6} />
        </div>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đăng ký'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-600">
        Đã có tài khoản?{' '}
        <button type="button" className="font-semibold text-sky-600 hover:text-sky-700" onClick={onGotoLogin}>
          Quay lại đăng nhập
        </button>
      </div>
    </div>
  );
}
