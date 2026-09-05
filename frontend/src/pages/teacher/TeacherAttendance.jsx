import { useState, useEffect, useCallback } from 'react';
import { attendanceService } from '../../services/attendanceService';
import { coursesService } from '../../services/coursesService';
import { enrollmentService } from '../../services/enrollmentService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function TeacherAttendance() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    coursesService.getAll({ size: 100 }).then(r => {
      const list = r.data.data?.content || [];
      const myCourses = list.filter(c => c.teacherName === user?.name || !user?.name);
      const activeCourses = myCourses.length > 0 ? myCourses : list;
      setCourses(activeCourses);
      if (activeCourses.length > 0) setSelectedCourse(activeCourses[0].id);
    });
  }, [user]);

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
        attList.forEach(a => {
          studentMap[a.studentId] = a.status;
        });

        const rows = enrollments.map(enr => ({
          studentId: enr.studentId,
          studentName: enr.studentName,
          studentStudentId: enr.studentStudentId,
          status: studentMap[enr.studentId] || 'PRESENT',
        }));

        setRecords(rows);
      })
      .catch(() => toast.error('Failed to load attendance'))
      .finally(() => setLoading(false));
  }, [selectedCourse, selectedDate]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleStatusChange = (studentId, status) => {
    setRecords(prev => prev.map(r => (r.studentId === studentId ? { ...r, status } : r)));
  };

  const handleMarkAll = (status) => {
    setRecords(prev => prev.map(r => ({ ...r, status })));
  };

  const handleSave = async () => {
    if (records.length === 0) {
      toast.error('No students to mark attendance for');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        courseId: Number(selectedCourse),
        date: selectedDate,
        attendanceList: records.map(r => ({
          studentId: r.studentId,
          status: r.status
        }))
      };
      await attendanceService.markBulk(payload);
      toast.success('Attendance submitted successfully!');
      fetchAttendance();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit attendance');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Take Class Attendance</h1>
          <p className="text-gray-500 text-sm mt-1">Select your course and date to record student presence.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={submitting || records.length === 0}
          className="btn-primary"
        >
          {submitting ? 'Saving...' : '💾 Submit Attendance'}
        </button>
      </div>

      <div className="card flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-56">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Course</label>
          <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.courseCode} — {c.courseName}
              </option>
            ))}
          </select>
        </div>

        <div className="w-48">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Date</label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
        </div>

        <div className="flex gap-2 self-end">
          <button type="button" onClick={() => handleMarkAll('PRESENT')} className="btn-secondary text-xs">
            All Present
          </button>
          <button type="button" onClick={() => handleMarkAll('ABSENT')} className="btn-secondary text-xs">
            All Absent
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading student attendance list...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Student ID', 'Student Name', 'Status Selection'].map(h => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {records.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-10 text-gray-400">No students enrolled in this course</td></tr>
              ) : (
                records.map(r => (
                  <tr key={r.studentId} className="hover:bg-gray-50">
                    <td className="table-td font-mono text-xs">{r.studentStudentId}</td>
                    <td className="table-td font-medium">{r.studentName}</td>
                    <td className="table-td">
                      <div className="flex gap-4">
                        {['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].map(st => (
                          <label key={st} className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                            <input
                              type="radio"
                              name={`t-att-${r.studentId}`}
                              value={st}
                              checked={r.status === st}
                              onChange={() => handleStatusChange(r.studentId, st)}
                              className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span className={
                              st === 'PRESENT' ? 'text-green-700' :
                              st === 'ABSENT' ? 'text-red-700' :
                              st === 'LATE' ? 'text-yellow-700' : 'text-blue-700'
                            }>
                              {st}
                            </span>
                          </label>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
