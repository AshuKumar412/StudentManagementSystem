import { useState, useEffect } from 'react';
import { studentsService } from '../../services/studentsService';
import { attendanceService } from '../../services/attendanceService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function StudentAttendance() {
  const { user } = useAuth();
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      studentsService.getAll({ search: user.email })
        .then(res => {
          const list = res.data.data?.content || [];
          if (list.length > 0) {
            const student = list[0];
            return attendanceService.getSummary(student.id);
          }
          return { data: { data: [] } };
        })
        .then(r => setSummary(r.data.data || []))
        .catch(() => toast.error('Failed to load attendance summary'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const totalClasses = summary.reduce((acc, s) => acc + (Number(s.totalClasses) || 0), 0);
  const totalPresent = summary.reduce((acc, s) => acc + (Number(s.presentCount) || 0), 0);
  const overallPct = totalClasses > 0 ? ((totalPresent / totalClasses) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Attendance Report</h1>
        <p className="text-gray-500 text-sm mt-1">Track your subject-wise presence and attendance criteria.</p>
      </div>

      {/* Overview Card */}
      <div className="card bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-indigo-200 text-sm font-medium">Overall Attendance</p>
            <h2 className="text-4xl font-black mt-1">{overallPct}%</h2>
            <p className="text-xs text-indigo-200 mt-2">
              {totalPresent} of {totalClasses} Total Classes Attended
            </p>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              Number(overallPct) >= 75 ? 'bg-green-400 text-green-950' : 'bg-red-400 text-red-950'
            }`}>
              {Number(overallPct) >= 75 ? '✓ Meets 75% Requirement' : '⚠ Low Attendance Warning'}
            </span>
          </div>
        </div>
      </div>

      {/* Courses Attendance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {summary.length === 0 ? (
          <div className="col-span-full card text-center py-10 text-gray-400">
            No attendance records found for your courses.
          </div>
        ) : (
          summary.map((item, idx) => {
            const pct = item.percentage != null ? item.percentage.toFixed(1) : 0;
            const isGood = Number(pct) >= 75;

            return (
              <div key={idx} className="card hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800 text-base">{item.courseName}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.presentCount} attended / {item.totalClasses} classes
                    </p>
                  </div>
                  <span className={`text-lg font-bold ${isGood ? 'text-green-600' : 'text-red-600'}`}>
                    {pct}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-2.5 mt-4 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full ${isGood ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(100, Math.max(0, Number(pct)))}%` }}
                  ></div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
