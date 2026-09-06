import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { departmentsService } from '../services/departmentsService';
import { studentsService } from '../services/studentsService';
import ThemeToggle from '../components/common/ThemeToggle';
import { CameraIcon, AcademicCapIcon, TrashIcon, CheckCircleIcon } from '../components/common/Icons';
import toast from 'react-hot-toast';

export default function StudentRegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    phone: '',
    departmentId: '',
    semester: '1',
    gender: 'Male',
    dateOfBirth: '',
    address: '',
    profilePicture: ''
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const { registerStudent } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    departmentsService.getAll()
      .then(res => setDepartments(res.data.data || []))
      .catch(() => {});
  }, []);

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      toast.error('Invalid image type. Please select a JPG, JPEG, PNG, or WEBP file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);

    setUploadingImage(true);
    try {
      const res = await studentsService.uploadImage(file);
      const imageUrl = res.data?.data?.imageUrl;
      setForm(prev => ({ ...prev, profilePicture: imageUrl }));
      toast.success('Profile picture uploaded!');
    } catch (err) {
      console.error('Image upload failed:', err);
      toast.error(err.friendlyMessage || err.response?.data?.message || 'Failed to upload image.');
      setImagePreview(null);
      setForm(prev => ({ ...prev, profilePicture: '' }));
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setForm(prev => ({ ...prev, profilePicture: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.success('Photo removed');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const parts = form.name.trim().split(' ');
      const firstName = parts[0] || form.name.trim();
      const lastName = parts.length > 1 ? parts.slice(1).join(' ') : ' ';

      const payload = {
        firstName,
        lastName,
        email: form.email.trim(),
        password: form.password,
        studentId: form.studentId.trim() || null,
        phone: form.phone.trim() || null,
        departmentId: form.departmentId ? Number(form.departmentId) : null,
        semester: form.semester ? Number(form.semester) : 1,
        gender: form.gender || 'Male',
        dateOfBirth: form.dateOfBirth || null,
        address: form.address.trim() || null,
        profilePicture: form.profilePicture || null,
      };

      await registerStudent(payload);
      toast.success('Registration submitted successfully!');
      setSubmitted(true);
    } catch (err) {
      console.error('Student registration error:', err);
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
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Application Submitted!</h2>
            <p className="text-[var(--text-secondary)] text-sm mt-1.5 leading-relaxed">
              Your student account has been registered with status{' '}
              <span className="font-semibold text-amber-600 dark:text-amber-400">PENDING APPROVAL</span>.
              Academic Administration will review your credentials before enabling portal access.
            </p>
          </div>

          <div className="p-4 bg-[var(--surface-muted)] border border-[var(--border)] rounded-xl text-left text-xs text-[var(--text-secondary)] space-y-2">
            <p className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
              <span>📋</span> Next Steps
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Administration verifies student profile & department enrollment.</li>
              <li>Once verified, you will be able to log in using your registered credentials.</li>
              <li>You will receive approval status directly upon signing in.</li>
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

      <div className="card p-0 max-w-4xl w-full overflow-hidden border border-[var(--border)] shadow-xl flex flex-col md:flex-row animate-fade-in">
        {/* Left Side Institutional Showcase */}
        <div className="md:w-5/12 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold mb-6">
              <AcademicCapIcon className="w-4 h-4" />
              <span>Student Admission</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Join our Academic Community
            </h1>
            <p className="text-indigo-200 text-xs leading-relaxed">
              Register your student profile for interactive course registration, attendance tracking, marks & grade audits.
            </p>
          </div>

          {/* Profile Picture Upload Box */}
          <div className="relative z-10 my-6 p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-center">
            <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-200 mb-3">
              Profile Photo
            </p>
            <div className="relative w-24 h-24 mx-auto mb-3">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Student Preview"
                  className="w-24 h-24 rounded-2xl object-cover shadow-lg border-2 border-white/80"
                />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-indigo-800/60 border-2 border-dashed border-indigo-400/50 flex flex-col items-center justify-center text-indigo-200">
                  <CameraIcon className="w-7 h-7 mb-1" />
                  <span className="text-[10px] font-medium">Add Photo</span>
                </div>
              )}
              {uploadingImage && (
                <div className="absolute inset-0 bg-black/60 rounded-2xl flex items-center justify-center text-white text-xs font-semibold backdrop-blur-xs">
                  Uploading...
                </div>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
            />

            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="px-3 py-1.5 bg-white text-indigo-950 rounded-lg text-xs font-semibold hover:bg-indigo-50 transition-colors shadow-xs cursor-pointer"
              >
                {imagePreview ? 'Change Photo' : 'Upload Photo'}
              </button>
              {imagePreview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-3 py-1.5 bg-rose-500/30 text-rose-200 hover:bg-rose-500/50 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>
            <p className="text-[10px] text-indigo-300 mt-2">JPG, PNG or WEBP (Max 5MB)</p>
          </div>

          <div className="relative z-10 text-xs text-indigo-300 flex items-center justify-between border-t border-white/10 pt-4">
            <span>Already have an account?</span>
            <Link to="/login" className="text-white font-bold hover:underline">
              Sign In Here →
            </Link>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="md:w-7/12 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Student Application Form</h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1">Please provide accurate personal and academic information.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="rahul@example.com"
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
                  Student Roll / ID
                </label>
                <input
                  name="studentId"
                  value={form.studentId}
                  onChange={handleChange}
                  placeholder="e.g. STU2026010"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                  Department
                </label>
                <select
                  name="departmentId"
                  value={form.departmentId}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="">Select Dept</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.departmentName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                  Semester
                </label>
                <select
                  name="semester"
                  value={form.semester}
                  onChange={handleChange}
                  className="input-field"
                >
                  {[1,2,3,4,5,6,7,8].map(s => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                  Residential Address
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="City, State"
                  className="input-field"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || uploadingImage}
              className="btn-primary w-full py-3 text-sm font-semibold mt-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? 'Submitting Application...' : 'Complete & Submit Registration'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-secondary)]">
            <div className="flex gap-3">
              <Link to="/register/faculty" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                👨‍🏫 Faculty
              </Link>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <Link to="/register/admin" className="text-amber-600 dark:text-amber-400 font-semibold hover:underline">
                👑 Admin
              </Link>
            </div>
            <Link to="/login" className="text-[var(--text-primary)] font-semibold hover:underline">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}