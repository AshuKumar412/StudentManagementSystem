import { useState, useEffect, useCallback } from 'react';
import { marksService } from '../../services/marksService';
import { coursesService } from '../../services/coursesService';
import { enrollmentService } from '../../services/enrollmentService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function TeacherMarks() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [marksList, setMarksList] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    studentId: '',
    assignmentMarks: '',
    midtermMarks: '',
    finalMarks: ''
  });

  useEffect(() => {
    coursesService.getAll({ size: 100 }).then(r => {
      const list = r.data.data?.content || [];
      const myCourses = list.filter(c => c.teacherName === user?.name || !user?.name);
      const activeCourses = myCourses.length > 0 ? myCourses : list;
      setCourses(activeCourses);
      if (activeCourses.length > 0) setSelectedCourse(activeCourses[0].id);
    });
  }, [user]);

  const fetchData = useCallback(() => {
    if (!selectedCourse) return;
    setLoading(true);

    Promise.all([
      marksService.getAll({ courseId: selectedCourse }),
      enrollmentService.getAll({ courseId: selectedCourse })
    ])
      .then(([marksRes, enrRes]) => {
        setMarksList(marksRes.data.data || []);
        setEnrolledStudents(enrRes.data.data || []);
      })
      .catch(() => toast.error('Failed to load marks'))
      .finally(() => setLoading(false));
  }, [selectedCourse]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openAdd = (student) => {
    setEditId(null);
    setForm({
      studentId: student.studentId,
      assignmentMarks: '',
      midtermMarks: '',
      finalMarks: ''
    });
    setShowModal(true);
  };

  const openEdit = (m) => {
    setEditId(m.id);
    setForm({
      studentId: m.studentId,
      assignmentMarks: m.assignmentMarks ?? '',
      midtermMarks: m.midtermMarks ?? '',
      finalMarks: m.finalMarks ?? ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        studentId: Number(form.studentId),
        courseId: Number(selectedCourse),
        assignmentMarks: form.assignmentMarks !== '' ? Number(form.assignmentMarks) : null,
        midtermMarks: form.midtermMarks !== '' ? Number(form.midtermMarks) : null,
        finalMarks: form.finalMarks !== '' ? Number(form.finalMarks) : null
      };

      if (editId) {
        await marksService.update(editId, payload);
        toast.success('Marks updated!');
      } else {
        await marksService.create(payload);
        toast.success('Marks saved!');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save marks');
    }
  };

  const combinedRows = enrolledStudents.map(enr => {
    const mark = marksList.find(m => m.studentId === enr.studentId);
    return { enr, mark };
  });

  const getGradeBadge = (grade) => {
    if (!grade) return <span className="badge-gray">—</span>;
    if (grade.startsWith('A')) return <span className="badge-green">{grade}</span>;
    if (grade.startsWith('B')) return <span className="badge-blue">{grade}</span>;
    if (grade.startsWith('C')) return <span className="badge-yellow">{grade}</span>;
    return <span className="badge-red">{grade}</span>;
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Student Gradebook</h1>
        <p className="text-gray-500 text-sm mt-1">Record and grade assignment, midterm, and final scores for your students.</p>
      </div>

      <div className="card max-w-md">
        <label className="block text-xs font-semibold text-gray-600 mb-1">Select Course</label>
        <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
          {courses.map(c => (
            <option key={c.id} value={c.id}>
              {c.courseCode} — {c.courseName}
            </option>
          ))}
        </select>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading student scores...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Student ID', 'Student Name', 'Assignment (20)', 'Midterm (30)', 'Final (50)', 'Total (100)', 'Percentage', 'Grade', 'Action'].map(h => (
                  <th key={h} className="table-th text-center">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {combinedRows.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-10 text-gray-400">No students enrolled in this course</td></tr>
              ) : (
                combinedRows.map(({ enr, mark }) => (
                  <tr key={enr.studentId} className="hover:bg-gray-50">
                    <td className="table-td font-mono text-xs">{enr.studentStudentId}</td>
                    <td className="table-td font-medium">{enr.studentName}</td>
                    <td className="table-td text-center">{mark?.assignmentMarks ?? '—'}</td>
                    <td className="table-td text-center">{mark?.midtermMarks ?? '—'}</td>
                    <td className="table-td text-center">{mark?.finalMarks ?? '—'}</td>
                    <td className="table-td text-center font-bold text-gray-800">{mark?.totalMarks ?? '—'}</td>
                    <td className="table-td text-center">{mark?.percentage != null ? `${mark.percentage.toFixed(1)}%` : '—'}</td>
                    <td className="table-td text-center">{getGradeBadge(mark?.grade)}</td>
                    <td className="table-td text-center">
                      {mark ? (
                        <button onClick={() => openEdit(mark)} className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">Edit</button>
                      ) : (
                        <button onClick={() => openAdd(enr)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">+ Enter Marks</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold">{editId ? 'Edit Student Marks' : 'Enter Student Marks'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Marks (Max: 20)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="20"
                  value={form.assignmentMarks}
                  onChange={e => setForm(f => ({ ...f, assignmentMarks: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Midterm Marks (Max: 30)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="30"
                  value={form.midtermMarks}
                  onChange={e => setForm(f => ({ ...f, midtermMarks: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Final Exam Marks (Max: 50)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={form.finalMarks}
                  onChange={e => setForm(f => ({ ...f, finalMarks: e.target.value }))}
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Save Marks</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
