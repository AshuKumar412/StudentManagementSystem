import { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { coursesService } from '../../services/coursesService';
import { enrollmentService } from '../../services/enrollmentService';
import { Icons } from '../../components/common/Icons';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

export default function AttendancePage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    coursesService.getAll({ size: 100 }).then((r) => {
      const list = r.data.data?.content || [];
      setCourses(list);
      if (list.length > 0) setSelectedCourse(list[0].id);
    });
  }, []);

  const fetchAttendance = useCallback(() => {
    if (!selectedCourse || !selectedDate) return;
    setLoading(true);

    Promise.all([
      attendanceService.get({ courseId: selectedCourse, date: selectedDate }),
      enrollmentService.getAll({ courseId: selectedCourse })
    ])
      .then(([attRes, enrRes]) => {
        const attList = attRes.data.data || [];
        const enrollments = enrRes.data.data || [];

        const studentMap = {};
        attList.forEach((a) => {
          studentMap[a.studentId] = { ...a, status: a.status };
        });

        const rows = enrollments.map((enr) => {
          const existing = studentMap[enr.studentId];
          return {
            studentId: enr.studentId,
            studentName: enr.studentName,
            studentStudentId: enr.studentStudentId,
            status: existing ? existing.status : 'PRESENT',
            attendanceId: existing ? existing.id : null
          };
        });

        setRecords(rows);
      })
      .catch(() => toast.error('Failed to load attendance records'))
      .finally(() => setLoading(false));
  }, [selectedCourse, selectedDate]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleStatusChange = (studentId, newStatus) => {
    setRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status: newStatus } : r))
    );
  };

  const handleMarkAll = (status) => {
    setRecords((prev) => prev.map((r) => ({ ...r, status })));
  };

  const handleSaveAttendance = async () => {
    if (records.length === 0) return;
    setSubmitting(true);
    try {
      const promises = records.map((r) => {
        if (r.attendanceId) {
          return attendanceService.update(r.attendanceId, {
            studentId: r.studentId,
            courseId: Number(selectedCourse),
            date: selectedDate,
            status: r.status
          });
        } else {
          return attendanceService.mark({
            studentId: r.studentId,
            courseId: Number(selectedCourse),
            date: selectedDate,
            status: r.status
          });
        }
      });

      await Promise.all(promises);
      toast.success('Attendance records saved successfully!');
      fetchAttendance();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save attendance');
    } finally {
      setSubmitting(false);
    }
  };

  // Metrics calculations
  const total = records.length;
  const presentCount = records.filter((r) => r.status === 'PRESENT').length;
  const absentCount = records.filter((r) => r.status === 'ABSENT').length;
  const lateCount = records.filter((r) => r.status === 'LATE').length;
  const attendanceRate = total > 0 ? Math.round(((presentCount + lateCount * 0.5) / total) * 100) : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <PageHeader
        title="Attendance Management"
        subtitle="Track, record, and analyze student daily attendance by course"
      >
        <button
          type="button"
          onClick={handleSaveAttendance}
          disabled={submitting || records.length === 0}
          className="btn-primary flex items-center gap-1.5 text-xs py-2 px-4 shadow-md disabled:opacity-50 cursor-pointer"
        >
          <Icons.Check className="w-4 h-4" />
          <span>{submitting ? 'Saving...' : 'Save Attendance'}</span>
        </button>
      </PageHeader>

      {/* Selectors Bar */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/60 shadow-xs flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[240px]">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
            Select Course *
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="text-xs"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.courseCode} - {c.courseName}
              </option>
            ))}
          </select>
        </div>

        <div className="w-52">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">
            Session Date *
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-xs"
          />
        </div>

        {/* Quick Batch Actions */}
        <div className="self-end pb-1 flex gap-2">
          <button
            type="button"
            onClick={() => handleMarkAll('PRESENT')}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
          >
            All Present
          </button>
          <button
            type="button"
            onClick={() => handleMarkAll('ABSENT')}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
          >
            All Absent
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/60 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase">Rate</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
            {attendanceRate}%
          </p>
          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                attendanceRate >= 75 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/60 shadow-xs">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase">Present</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {presentCount}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Students in room</p>
        </div>

        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/60 shadow-xs">
          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase">Absent</p>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-0.5">
            {absentCount}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Unexcused</p>
        </div>

        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/60 shadow-xs">
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase">Late</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
            {lateCount}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Delayed arrival</p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-100 dark:border-slate-700/60 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={5} cols={4} />
          </div>
        ) : records.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Icons.Attendance}
              title="No enrolled students found"
              description="There are currently no students enrolled in this course to mark attendance."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="table-th">Student</th>
                  <th className="table-th">Roll ID</th>
                  <th className="table-th">Status</th>
                  <th className="table-th text-right">Quick Mark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {records.map((r) => (
                  <tr
                    key={r.studentId}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="table-td font-semibold text-slate-800 dark:text-slate-200">
                      {r.studentName}
                    </td>

                    <td className="table-td font-mono text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                      {r.studentStudentId || '—'}
                    </td>

                    <td className="table-td">
                      <StatusBadge status={r.status} />
                    </td>

                    <td className="table-td text-right">
                      <div className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-900">
                        {['PRESENT', 'LATE', 'ABSENT'].map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(r.studentId, st)}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                              r.status === st
                                ? st === 'PRESENT'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : st === 'LATE'
                                  ? 'bg-amber-500 text-white shadow-xs'
                                  : 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                            }`}
                          >
                            {st === 'PRESENT' ? 'Present' : st === 'LATE' ? 'Late' : 'Absent'}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}