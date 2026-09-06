import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { departmentsService } from '../services/departmentsService';
import ThemeToggle from '../components/common/ThemeToggle';
import { UserGroupIcon, BuildingOfficeIcon } from '../components/common/Icons';
import toast from 'react-hot-toast';

export default function FacultyRegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    departmentId: '',
    designation: 'Assistant Professor',
    qualification: '',
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { registerFaculty } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    departmentsService.getAll()
      .then(res => setDepartments(res.data.data || []))
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim() || null,
        departmentId: form.departmentId ? Number(form.departmentId) : null,
        designation: form.designation || null,
        qualification: form.qualification.trim() || null,
      };

      await registerFaculty(payload);
      toast.success('Registration submitted successfully!');
      setSubmitted(true);
    } catch (err) {
      console.error('Faculty registration error:', err);
      const msg = err.friendlyMessage || err.response?.data?.message || err.message || 'Failed to submit registration';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--bg-app)] flex items-center justify-center p-4">
        <div className="card max-w-md w-full p-8 text-center animate-scale-up space-y-5">
          <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/50 text-amber-600 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-xs border border-amber-200 dark:border-amber-900/50">
            ⏳
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Faculty Application Received!</h2>
            <p className="text-[var(--text-secondary)] text-sm mt-1.5 leading-relaxed">
              Your faculty account is created with status{' '}
              <span className="font-semibold text-amber-600 dark:text-amber-400">PENDING APPROVAL</span>.
              The University Administration will verify your department affiliation before enabling portal access.
            </p>
          </div>

          <div className="p-4 bg-[var(--surface-muted)] border border-[var(--border)] rounded-xl text-left text-xs text-[var(--text-secondary)] space-y-2">
            <p className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
              <span>📋</span> Approval Protocol
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Admin verifies faculty credentials and assigned department.</li>
              <li>Once approved, your account is activated for syllabus, attendance, and grading.</li>
              <li>You can log in directly using your registered credentials once verified.</li>
            </ul>
          </div>

          <Link
            to="/login"
            className="btn-primary w-full py-3 text-sm flex items-center justify-center cursor-pointer"
          >
            Return to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-app)] py-10 px-4 sm:px-6 flex items-center justify-center relative">
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="card max-w-xl w-full p-6 sm:p-8 space-y-6 border border-[var(--border)] shadow-xl animate-fade-in">
        <div className="text-center">
          <div className="w-14 h-14 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-md">
            👨‍🏫
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Faculty Registration</h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Join the academic faculty portal to manage courses, track student attendance, and submit grades
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                Full Name (with title) *
              </label>
              <input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Dr. Rajesh Kumar"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                Work / Academic Email *
              </label>
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="rajesh@sms.com"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                Password * (Min 6 chars)
              </label>
              <input
                required
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                Confirm Password *
              </label>
              <input
                required
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                Contact Phone
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                Academic Department
              </label>
              <select
                name="departmentId"
                value={form.departmentId}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select Department</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.departmentName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                Designation
              </label>
              <input
                name="designation"
                value={form.designation}
                onChange={handleChange}
                placeholder="Assistant Professor / Professor"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                Highest Qualification
              </label>
              <input
                name="qualification"
                value={form.qualification}
                onChange={handleChange}
                placeholder="Ph.D. / M.Tech in CS"
                className="input-field"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-sm font-semibold mt-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? 'Submitting Application...' : 'Submit Faculty Registration'}
          </button>
        </form>

        <div className="pt-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-secondary)]">
          <div className="flex gap-3">
            <Link to="/register/student" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              ← Student
            </Link>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <Link to="/register/admin" className="font-semibold text-amber-600 dark:text-amber-400 hover:underline">
              👑 Admin
            </Link>
          </div>
          <Link to="/login" className="font-semibold text-[var(--text-primary)] hover:underline">
            Already registered? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}