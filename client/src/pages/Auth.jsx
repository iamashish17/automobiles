import { useEffect, useMemo, useState } from 'react';
import { Show, SignInButton, SignUpButton } from '@clerk/react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../component/layout/Navbar';
import { apiRequest } from '../lib/api';
import { useAuth } from '../context/useAuth';

const fieldClass =
  'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100';

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login';
  const navigate = useNavigate();
  const { isAuthenticated, user, setSession } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(String(user?.role || '').toLowerCase() === 'admin' ? '/admin-dashboard' : '/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate, user?.role]);

  const title = useMemo(() => (isLogin ? 'Login to your account' : 'Create your account'), [isLogin]);
  const submitLabel = isLogin ? 'Login' : 'Register';

  const updateField = (field) => (event) => {
    const value = event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.email.trim() || !form.password.trim() || (!isLogin && !form.name.trim())) {
      setError(isLogin ? 'Email and password are required.' : 'Name, email and password are required.');
      return;
    }

    if (!isLogin && form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const data = await apiRequest(endpoint, {
        method: 'POST',
        body: payload,
      });

      setSession(data);
      navigate(String(data.user?.role || '').toLowerCase() === 'admin' ? '/admin-dashboard' : '/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="px-4 py-10 sm:py-14">
        <section className="mx-auto w-full max-w-md rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-8 flex items-center gap-3 rounded-2xl bg-gray-100 p-1">
          <Link
            to="/login"
            className={`flex-1 rounded-xl px-4 py-2 text-center text-sm font-medium transition ${
              isLogin ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Login
          </Link>
          <Link
            to="/register"
            className={`flex-1 rounded-xl px-4 py-2 text-center text-sm font-medium transition ${
              isLogin ? 'text-gray-600 hover:text-gray-900' : 'bg-blue-600 text-white'
            }`}
          >
            Register
          </Link>
          </div>

          <h2 className="text-3xl font-semibold tracking-tight text-gray-900">{title}</h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? 'Enter your credentials to continue.' : 'Create an account in a few seconds.'}
          </p>

          <Show when="signed-out">
            <div className="mt-6">
              {isLogin ? (
                <SignInButton mode="modal" fallbackRedirectUrl="/" forceRedirectUrl="/">
                  <button
                    type="button"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                  >
                    Continue with Clerk
                  </button>
                </SignInButton>
              ) : (
                <SignUpButton mode="modal" fallbackRedirectUrl="/" forceRedirectUrl="/">
                  <button
                    type="button"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                  >
                    Create account with Clerk
                  </button>
                </SignUpButton>
              )}
              <div className="mt-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-gray-200" />
                <span className="text-xs uppercase tracking-[0.2em] text-gray-400">or</span>
                <span className="h-px flex-1 bg-gray-200" />
              </div>
            </div>
          </Show>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={updateField('name')}
                  placeholder="John Doe"
                  className={fieldClass}
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={updateField('email')}
                placeholder="you@example.com"
                className={fieldClass}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={updateField('password')}
                placeholder="********"
                className={fieldClass}
              />
            </div>

            {!isLogin && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={updateField('confirmPassword')}
                  placeholder="********"
                  className={fieldClass}
                />
              </div>
            )}

            {error ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Please wait...' : submitLabel}
            </button>

            <p className="text-center text-sm text-gray-600">
              {isLogin ? (
                <>
                  Don&apos;t have an account?{' '}
                  <Link to="/register" className="font-medium text-gray-900 underline underline-offset-4">
                    Register
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-gray-900 underline underline-offset-4">
                    Login
                  </Link>
                </>
              )}
            </p>
          </form>
        </section>
      </main>
    </div>
  );
}
