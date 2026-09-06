import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/common/ThemeToggle';
import { AcademicCapIcon, ShieldCheckIcon, UserGroupIcon, BookOpenIcon } from '../components/common/Icons';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState('ADMIN'); // Default or URL-driven
  const [email, setEmail] = useState('admin@sms.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Pick up query param or location state if provided (e.g. ?role=admin or after registration)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    if (roleParam) {
      const upper = roleParam.toUpperCase();
      if (['ADMIN', 'STUDENT', 'TEACHER', 'FACULTY'].includes(upper)) {
        setSelectedRole(upper === 'FACULTY' ? 'TEACHER' : upper);
      }
    }
    if (location.state?.prefillEmail) {
      setEmail(location.state.prefillEmail);
      setPassword('');
      setSelectedRole('ADMIN');
    }
  }, [location]);

  // Update sample email when switching tabs if form is still using default values
  const handleRoleTabChange = (role) => {
    setSelectedRole(role);
    setErrorMessage('');
    if (role === 'ADMIN') {
      setEmail('admin@sms.com');
      setPassword('password');
    } else if (role === 'TEACHER') {
      setEmail('rajesh@sms.com');
      setPassword('password123');
    } else if (role === 'STUDENT') {
      setEmail('rahul@sms.com');
      setPassword('password123');
    }
  };

  const handleDemoFill = (demoEmail, demoPassword, role) => {
    if (role) setSelectedRole(role);
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
            Streamlined academic governance and campus management.
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Manage administrative workflows, student enrollments, faculty course assignments, attendance, grading, and fees with high reliability.
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md space-y-6 my-auto">
          {/* Mobile branding header */}
          <div className="text-center lg:text-left">
            <div className="lg:hidden w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white mx-auto mb-3 shadow-md">
              <AcademicCapIcon className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
              Sign in to Portal
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1 font-medium">
              Select your portal role and enter your credentials
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="flex rounded-xl bg-[var(--surface-muted)] p-1 border border-[var(--border)] gap-1 shadow-2xs">
            <button
              type="button"
              onClick={() => handleRoleTabChange('ADMIN')}
              className={`flex-1 py-2 px-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRole === 'ADMIN'
                  ? 'bg-[var(--surface)] text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-200/50 dark:border-indigo-800/50'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>??</span>
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleTabChange('TEACHER')}
              className={`flex-1 py-2 px-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRole === 'TEACHER'
                  ? 'bg-[var(--surface)] text-purple-600 dark:text-purple-400 shadow-sm border border-purple-200/50 dark:border-purple-800/50'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>?????</span>
              <span>Faculty</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleTabChange('STUDENT')}
              className={`flex-1 py-2 px-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedRole === 'STUDENT'
                  ? 'bg-[var(--surface)] text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-200/50 dark:border-emerald-800/50'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <span>?????</span>
              <span>Student</span>
            </button>
          </div>

          {/* Error Alert Banner */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
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
                placeholder={selectedRole === 'ADMIN' ? 'admin@sms.com' : selectedRole === 'TEACHER' ? 'rajesh@sms.com' : 'rahul@sms.com'}
                className="input-field"
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pr-10"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm cursor-pointer p-1"
                  tabIndex="-1"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '??' : '???'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-md font-semibold text-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to {selectedRole === 'ADMIN' ? 'Admin Dashboard' : selectedRole === 'TEACHER' ? 'Faculty Portal' : 'Student Portal'}</span>
                  <span>?</span>
                </>
              )}
            </button>
          </form>

          {/* Registration Options Section */}
          <div className="pt-4 border-t border-[var(--border)] text-center space-y-2.5">
            <p className="text-xs text-[var(--text-muted)] font-medium">New applicant, faculty member, or administrator?</p>
            <div className="grid grid-cols-3 gap-2">
              <Link
                to="/register/student"
                className="py-2 px-2 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200/60 dark:border-indigo-800/40 transition-colors text-center truncate shadow-2xs"
                title="Student Registration"
              >
                ????? Student
              </Link>
              <Link
                to="/register/faculty"
                className="py-2 px-2 text-xs font-semibold rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200/60 dark:border-purple-800/40 transition-colors text-center truncate shadow-2xs"
                title="Faculty Registration"
              >
                ????? Faculty
              </Link>
              <Link
                to="/register/admin"
                className="py-2 px-2 text-xs font-semibold rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200/60 dark:border-amber-800/40 transition-colors text-center truncate shadow-2xs"
                title="Admin Registration"
              >
                ?? Admin
              </Link>
            </div>
          </div>

          {/* Demo Credentials Quick-Fill */}
          <div className="card p-3.5 bg-[var(--surface-muted)] text-xs border border-[var(--border)]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                <span>?</span> Quick Demo Sign-In
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">click to fill credentials</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoFill('admin@sms.com', 'password', 'ADMIN')}
                className="py-1.5 px-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg hover:border-indigo-500 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold text-[11px] transition-all cursor-pointer shadow-2xs text-center"
              >
                ?? Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('rajesh@sms.com', 'password123', 'TEACHER')}
                className="py-1.5 px-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg hover:border-indigo-500 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold text-[11px] transition-all cursor-pointer shadow-2xs text-center"
              >
                ????? Teacher
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('rahul@sms.com', 'password123', 'STUDENT')}
                className="py-1.5 px-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg hover:border-indigo-500 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-semibold text-[11px] transition-all cursor-pointer shadow-2xs text-center"
              >
                ?? Student
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

