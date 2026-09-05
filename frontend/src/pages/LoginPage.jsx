import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/common/ThemeToggle';
import { AcademicCapIcon, UserGroupIcon, ShieldCheckIcon, BookOpenIcon } from '../components/common/Icons';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setErrorMessage('Please enter both email address and password.');
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const user = await login({ email: trimmedEmail, password });
      toast.success(`Welcome back, ${user.name || 'User'}!`);
      const role = (user.role || '').replace(/^ROLE_/, '').toUpperCase();
      const routes = {
        ADMIN: '/admin/dashboard',
        TEACHER: '/teacher/dashboard',
        FACULTY: '/teacher/dashboard',
        STUDENT: '/student/dashboard'
      };
      const destination = routes[role] || '/login';
      navigate(destination, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      const friendlyErr =
        err.friendlyMessage ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Unable to connect to the server. Please make sure the backend is running.';
      setErrorMessage(friendlyErr);
      toast.error(friendlyErr, { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] flex relative overflow-hidden transition-colors">
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Left Column: University Branding & Showcase (hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-12 text-white flex-col justify-between relative overflow-hidden border-r border-slate-800">
        {/* Glow ambient effects */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <AcademicCapIcon className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight">University ERP</span>
              <span className="block text-xs text-indigo-300 font-medium">Enterprise Campus Portal</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6 my-auto max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-semibold text-indigo-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Spring Boot 3 + React 18 Enterprise Suite
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Streamlined academic governance and student success.
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Manage course registrations, track attendance rates, grade distributions, and fee collections in one unified institution system.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-bold text-indigo-400">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">Automated Workflows</div>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="text-2xl font-bold text-emerald-400">Real-time</div>
              <div className="text-xs text-slate-400 mt-0.5">Institutional Analytics</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400 flex items-center justify-between border-t border-white/10 pt-6">
          <span>&copy; {new Date().getFullYear()} University Management System</span>
          <span className="text-slate-500">v2.4.0 High-Availability</span>
        </div>
      </div>

      {/* Right Column: Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile branding header */}
          <div className="text-center lg:text-left mb-6">
            <div className="lg:hidden w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-md">
              <AcademicCapIcon className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
              Sign in to Portal
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1 font-medium">
              Enter your credentials to access your dashboard
            </p>
          </div>

          {/* Error Alert Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-fade-in">
              <svg className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sms.com"
                className="input-field"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pr-10"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm cursor-pointer"
                  tabIndex="-1"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>
          </form>

          {/* Registration Links */}
          <div className="pt-4 border-t border-[var(--border)] text-center space-y-2">
            <p className="text-xs text-[var(--text-muted)]">New applicant or faculty member?</p>
            <div className="flex gap-2">
              <Link
                to="/register/student"
                className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 border border-indigo-200/60 dark:border-indigo-800/40 transition-colors text-center"
              >
                👨‍🎓 Student Registration
              </Link>
              <Link
                to="/register/faculty"
                className="flex-1 py-2 px-3 text-xs font-semibold rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 border border-purple-200/60 dark:border-purple-800/40 transition-colors text-center"
              >
                👨‍🏫 Faculty Registration
              </Link>
            </div>
          </div>

          {/* Demo Credentials Quick-Fill */}
          <div className="card p-3.5 bg-[var(--surface-muted)] text-xs border border-[var(--border)]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                <span>⚡</span> Quick Demo Sign-In
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">click to fill</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill('admin@sms.com', 'password123')}
                className="py-1.5 px-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg hover:border-indigo-500 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold text-[11px] transition-all cursor-pointer shadow-2xs"
              >
                👑 Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('rajesh@sms.com', 'password123')}
                className="py-1.5 px-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg hover:border-indigo-500 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold text-[11px] transition-all cursor-pointer shadow-2xs"
              >
                👨‍🏫 Teacher
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('rahul@sms.com', 'password123')}
                className="py-1.5 px-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg hover:border-indigo-500 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold text-[11px] transition-all cursor-pointer shadow-2xs"
              >
                🎓 Student
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}