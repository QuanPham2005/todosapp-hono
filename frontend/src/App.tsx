import { useEffect, useState } from 'react';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { getStoredAuth, setStoredAuth, clearStoredAuth } from './lib/api';
import type { AuthUser } from './types';

type AuthState = { token: string; user: AuthUser } | null;
type PageState = 'login' | 'register';

export default function App() {
  const [auth, setAuth] = useState<AuthState>(null);
  const [page, setPage] = useState<PageState>('login');

  useEffect(() => {
    const stored = getStoredAuth();
    if (stored) {
      setAuth(stored);
    }
  }, []);

  const handleLogin = (user: AuthUser, token: string) => {
    setStoredAuth(token, user);
    setAuth({ user, token });
  };

  const handleLogout = () => {
    clearStoredAuth();
    setAuth(null);
    setPage('login');
  };

  if (!auth) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-3xl">
          {page === 'login' ? (
            <LoginPage onSuccess={handleLogin} onGotoRegister={() => setPage('register')} />
          ) : (
            <RegisterPage onSuccess={handleLogin} onGotoLogin={() => setPage('login')} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {auth.user.role === 'ADMIN' ? (
        <AdminDashboard currentUser={auth.user} onLogout={handleLogout} />
      ) : (
        <UserDashboard currentUser={auth.user} onLogout={handleLogout} />
      )}
    </div>
  );
}
