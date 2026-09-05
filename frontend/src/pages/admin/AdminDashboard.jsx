import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { enrollmentService } from '../../services/enrollmentService';
import { registrationService } from '../../services/registrationService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import { Icons } from '../../components/common/Icons';
import StatCard from '../../components/common/StatCard';
import StatusBadge from '../../components/common/StatusBadge';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [pendingRegs, setPendingRegs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardService.getAdmin(),
      enrollmentService.getAll(),
      registrationService.getPendingRegistrations()
    ])
      .then(([dashRes, enrollRes, regRes]) => {
        setData(dashRes.data?.data);
        const list = enrollRes.data?.data || [];
        setRecentEnrollments(list.slice(-5).reverse());
        setPendingRegs(regRes.data?.data || []);
      })
      .catch(() => toast.error('Failed to load dashboard metrics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
        <CardSkeleton count={8} />
      </div>
    );
  }

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* University Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-7 sm:p-9 shadow-xl border border-indigo-900/40">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 backdrop-blur-md text-indigo-300 text-xs font-semibold border border-indigo-400/20">
            <Icons.GraduationCap className="w-4 h-4 text-indigo-400" />
            <span>Academic Year 2026–2027</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Academic Operations Portal
          </h1>

          <p className="text-indigo-200/80 text-sm leading-relaxed">
            Monitor admissions, faculty allocations, course registrations, daily attendance metrics, and fee collection in real-time.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/admin/students"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <Icons.Students className="w-4 h-4" />
              <span>Manage Students</span>
            </Link>
            <Link
              to="/admin/enrollments"
              className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 backdrop-blur-xs"
            >
              <Icons.Plus className="w-4 h-4" />
              <span>New Course Enrollment</span>
            </Link>
            {pendingRegs.length > 0 && (
              <Link
                to="/admin/registrations"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
              >
                <Icons.AlertCircle className="w-4 h-4" />
                <span>{pendingRegs.length} Approvals Pending</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 8 Statistics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Total Students"
          value={data?.totalStudents}
          icon={Icons.Students}
          color="indigo"
          change="Registered"
          subtitle="Enrolled learners"
        />
        <StatCard
          title="Faculty Members"
          value={data?.totalTeachers}
          icon={Icons.Teacher}
          color="purple"
          change="Active"
          subtitle="Professors & TAs"
        />
        <StatCard
          title="Active Courses"
          value={data?.totalCourses}
          icon={Icons.Courses}
          color="blue"
          change="Curriculum"
          subtitle="Active subjects"
        />
        <StatCard
          title="Academic Departments"
          value={data?.totalDepartments}
          icon={Icons.Department}
          color="emerald"
          change="Faculties"
          subtitle="Schools & Depts"
        />
        <StatCard
          title="Total Enrollments"
          value={data?.totalEnrollments}
          icon={Icons.Enrollments}
          color="indigo"
          change="Active batch"
          subtitle="Course seats"
        />
        <StatCard
          title="Attendance Today"
          value={data?.presentToday}
          icon={Icons.Attendance}
          color="emerald"
          change="Checked in"
          subtitle="Present students"
        />
        <StatCard
          title="Fees Collected"
          value={`₹${Number(data?.collectedFees || 0).toLocaleString()}`}
          icon={Icons.Fees}
          color="emerald"
          change="Cleared"
          subtitle="Tuition received"
        />
        <StatCard
          title="Fees Pending"
          value={`₹${Number(data?.pendingFees || 0).toLocaleString()}`}
          icon={Icons.Fees}
          color="rose"
          isPositive={false}
          change="Outstanding"
          subtitle="Due balance"
        />
      </div>

      {/* Analytics Charts & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Bar Chart & Recent Enrollments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Department Distribution Chart */}
          <div className="card shadow-xs dark:bg-slate-800/90 dark:border-slate-700/60 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Students by Department
                </h3>
                <p className="text-xs text-slate-400">Department distribution breakdown</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                Enrollment Overview
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.studentsByDepartment || []}>
                  <XAxis dataKey="department" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                  />
                  <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Enrollments Table */}
          <div className="card shadow-xs dark:bg-slate-800/90 dark:border-slate-700/60 p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/60">
              <div className="flex items-center gap-2">
                <Icons.Enrollments className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Recent Course Enrollments
                </h3>
              </div>
              <Link
                to="/admin/enrollments"
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1"
              >
                <span>View Directory</span>
                <Icons.ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr>
                    <th className="table-th">Student</th>
                    <th className="table-th">Course Code</th>
                    <th className="table-th">Course Title</th>
                    <th className="table-th">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {recentEnrollments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400">
                        No enrollment records found.
                      </td>
                    </tr>
                  ) : (
                    recentEnrollments.map((e) => (
                      <tr key={e.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors">
                        <td className="table-td font-semibold text-slate-800 dark:text-slate-200">
                          {e.studentName}
                        </td>
                        <td className="table-td font-mono text-indigo-600 dark:text-indigo-400 font-medium">
                          {e.courseCode}
                        </td>
                        <td className="table-td text-slate-600 dark:text-slate-300">
                          {e.courseName}
                        </td>
                        <td className="table-td">
                          <StatusBadge status={e.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Approvals Queue & Course Distribution */}
        <div className="space-y-6">
          {/* Pending Registrations Widget */}
          <div className="card shadow-xs dark:bg-slate-800/90 dark:border-slate-700/60 border-amber-200/60 dark:border-amber-900/40 bg-gradient-to-br from-white to-amber-50/20 dark:from-slate-800 dark:to-amber-950/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Icons.AlertCircle className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Pending Approvals
                </h3>
              </div>
              <span className="px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-full">
                {pendingRegs.length}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              New student and faculty applications awaiting verification.
            </p>

            {pendingRegs.length > 0 ? (
              <div className="space-y-2 mb-4">
                {pendingRegs.slice(0, 3).map((r) => (
                  <div
                    key={r.id}
                    className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700/80 shadow-2xs flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {r.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[130px]">
                        {r.email}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-md">
                      {r.role}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-center mb-4">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  ✓ All registrations verified
                </p>
              </div>
            )}

            <Link
              to="/admin/registrations"
              className="btn-primary w-full text-xs font-semibold py-2.5 shadow-md flex items-center justify-center gap-1.5"
            >
              <Icons.FileText className="w-4 h-4" />
              <span>Open Verification Queue</span>
            </Link>
          </div>

          {/* Course Enrollment Pie Chart */}
          <div className="card shadow-xs dark:bg-slate-800/90 dark:border-slate-700/60 p-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
              Course Distribution
            </h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.courseEnrollments || []}
                    dataKey="count"
                    nameKey="course"
                    cx="50%"
                    cy="50%"
                    outerRadius={65}
                    innerRadius={35}
                    paddingAngle={4}
                  >
                    {(data?.courseEnrollments || []).map((_, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '11px'
                    }}
                  />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}