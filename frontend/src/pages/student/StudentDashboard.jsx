import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import {
  BookOpenIcon,
  BanknotesIcon,
  UserIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  CreditCardIcon,
  ArrowUpRightIcon
} from '../../components/common/Icons';
import toast from 'react-hot-toast';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getStudent()
      .then(r => setData(r.data.data))
      .catch(() => toast.error('Failed to load student dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 sm:p-8 shadow-sm">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md border border-white/20 text-indigo-200">
              <span>🎓</span> Student Academic Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {user?.name || 'Student'}!
            </h1>
            <p className="text-indigo-200 text-xs sm:text-sm max-w-xl">
              Track your course standing, submit registrations, check upcoming exams, and inspect fee payments.
            </p>
          </div>
          <Link
            to="/student/profile"
            className="btn-secondary text-xs self-start sm:self-auto bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-xs flex items-center gap-1.5"
          >
            <UserIcon className="w-4 h-4" />
            View Full Profile
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="Enrolled Courses"
          value={data?.enrolledCourses ?? 0}
          icon={BookOpenIcon}
          color="indigo"
          subtitle="Registered this semester"
        />

        <StatCard
          title="Outstanding Fees"
          value={`₹${Number(data?.pendingFees || 0).toLocaleString()}`}
          icon={BanknotesIcon}
          color={Number(data?.pendingFees || 0) > 0 ? "rose" : "emerald"}
          subtitle={Number(data?.pendingFees || 0) > 0 ? "Dues pending clearance" : "All cleared"}
        />

        <StatCard
          title="Enrollment Status"
          value="Active Student"
          icon={UserIcon}
          color="emerald"
          subtitle="Verified status"
        />
      </div>

      {/* Quick Navigation Cards */}
      <div>
        <h2 className="text-base font-bold text-[var(--text-primary)] mb-3">Academic Shortcuts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/student/profile"
            className="card p-5 group hover:border-indigo-500 hover:shadow-md transition-all flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <UserIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">My Profile</h3>
                <ArrowUpRightIcon className="w-4 h-4 text-[var(--text-muted)] group-hover:text-indigo-600 transition-colors" />
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Review personal credentials, semester & photo</p>
            </div>
          </Link>

          <Link
            to="/student/courses"
            className="card p-5 group hover:border-blue-500 hover:shadow-md transition-all flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <BookOpenIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">My Courses</h3>
                <ArrowUpRightIcon className="w-4 h-4 text-[var(--text-muted)] group-hover:text-blue-600 transition-colors" />
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Registered courses, teachers & credits</p>
            </div>
          </Link>

          <Link
            to="/student/attendance"
            className="card p-5 group hover:border-emerald-500 hover:shadow-md transition-all flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CheckCircleIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">Attendance Report</h3>
                <ArrowUpRightIcon className="w-4 h-4 text-[var(--text-muted)] group-hover:text-emerald-600 transition-colors" />
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Check subject-wise attendance percentages</p>
            </div>
          </Link>

          <Link
            to="/student/results"
            className="card p-5 group hover:border-purple-500 hover:shadow-md transition-all flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <PencilSquareIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">Marks & Grades</h3>
                <ArrowUpRightIcon className="w-4 h-4 text-[var(--text-muted)] group-hover:text-purple-600 transition-colors" />
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Exam scores, assignments & GPA standings</p>
            </div>
          </Link>

          <Link
            to="/student/fees"
            className="card p-5 group hover:border-amber-500 hover:shadow-md transition-all flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CreditCardIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">Fee Payments</h3>
                <ArrowUpRightIcon className="w-4 h-4 text-[var(--text-muted)] group-hover:text-amber-600 transition-colors" />
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Check dues, receipts & payment history</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
