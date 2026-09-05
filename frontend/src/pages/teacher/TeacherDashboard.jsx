import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import StatCard from '../../components/common/StatCard';
import {
  BookOpenIcon,
  UserGroupIcon,
  CheckCircleIcon,
  PencilSquareIcon,
  ArrowUpRightIcon
} from '../../components/common/Icons';
import toast from 'react-hot-toast';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getTeacher()
      .then(r => setData(r.data.data))
      .catch(() => toast.error('Failed to load teacher dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-800 to-slate-900 text-white p-6 sm:p-8 shadow-sm">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md border border-white/20 text-emerald-200">
              <span>👨‍🏫</span> Faculty Instructor Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome, {user?.name || 'Professor'}!
            </h1>
            <p className="text-emerald-200 text-xs sm:text-sm max-w-xl">
              Manage your course curriculums, register daily attendance, and record semester marks efficiently.
            </p>
          </div>
          <Link
            to="/teacher/courses"
            className="btn-secondary text-xs self-start sm:self-auto bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-xs flex items-center gap-1.5"
          >
            <BookOpenIcon className="w-4 h-4" />
            My Active Courses
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard
          title="Assigned Courses"
          value={data?.assignedCourses ?? 0}
          icon={BookOpenIcon}
          color="emerald"
          subtitle="Taught this semester"
        />

        <StatCard
          title="Enrolled Students"
          value={data?.totalStudents ?? 0}
          icon={UserGroupIcon}
          color="blue"
          subtitle="Across all classes"
        />

        <StatCard
          title="Present Today"
          value={data?.presentToday ?? 0}
          icon={CheckCircleIcon}
          color="teal"
          subtitle="Daily attendance count"
        />
      </div>

      {/* Quick Action Shortcuts */}
      <div>
        <h2 className="text-base font-bold text-[var(--text-primary)] mb-3">Teaching Operations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/teacher/courses"
            className="card p-5 group hover:border-emerald-500 hover:shadow-md transition-all flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <BookOpenIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">Curriculum & Courses</h3>
                <ArrowUpRightIcon className="w-4 h-4 text-[var(--text-muted)] group-hover:text-emerald-600 transition-colors" />
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Review enrolled student rosters and department syllabus</p>
            </div>
          </Link>

          <Link
            to="/teacher/attendance"
            className="card p-5 group hover:border-blue-500 hover:shadow-md transition-all flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <CheckCircleIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">Take Attendance</h3>
                <ArrowUpRightIcon className="w-4 h-4 text-[var(--text-muted)] group-hover:text-blue-600 transition-colors" />
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Quick-mark present, late, or absent for today's lecture</p>
            </div>
          </Link>

          <Link
            to="/teacher/marks"
            className="card p-5 group hover:border-purple-500 hover:shadow-md transition-all flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <PencilSquareIcon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-[var(--text-primary)]">Enter Marks</h3>
                <ArrowUpRightIcon className="w-4 h-4 text-[var(--text-muted)] group-hover:text-purple-600 transition-colors" />
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Submit internal assignments, midterms, and finals</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
