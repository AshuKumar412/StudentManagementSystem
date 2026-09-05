import { useState, useEffect, useCallback } from 'react';
import { marksService } from '../../services/marksService';
import { coursesService } from '../../services/coursesService';
import { enrollmentService } from '../../services/enrollmentService';
import { Icons } from '../../components/common/Icons';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

export default function MarksPage() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [marksList, setMarksList] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    studentId: '',
    courseId: '',
    assignmentMarks: '',
    midtermMarks: '',
    finalMarks: ''
  });

  useEffect(() => {
    coursesService.getAll({ size: 100 }).then((r) => {
      const list = r.data.data?.content || [];
      setCourses(list);
      if (list.length > 0) setSelectedCourse(list[0].id);
    });
  }, []);

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
      courseId: selectedCourse,
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
      courseId: m.courseId,
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
        courseId: Number(form.courseId),
        assignmentMarks: form.assignmentMarks !== '' ? Number(form.assignmentMarks) : null,
        midtermMarks: form.midtermMarks !== '' ? Number(form.midtermMarks) : null,
        finalMarks: form.finalMarks !== '' ? Number(form.finalMarks) : null
      };

      if (editId) {
        await marksService.update(editId, payload);
        toast.success('Marks updated successfully!');
      } else {
        await marksService.create(payload);
        toast.success('Marks recorded successfully!');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this grade record?')) return;
    try {
      await marksService.delete(id);
      toast.success('Marks record deleted');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  // Grade calculation helper
  const computeGrade = (total) => {
    if (total >= 90) return 'A+';
    if (total >= 80) return 'A';
    if (total >= 70) return 'B+';
    if (total >= 60) return 'B';
    if (total >= 50) return 'C';
    return 'F';
  };

  const studentsWithMarks = enrolledStudents.map((enr) => {
    const markRecord = marksList.find((m) => m.studentId === enr.studentId);
    const total = markRecord?.totalMarks ?? (
      (markRecord?.assignmentMarks || 0) +
      (markRecord?.midtermMarks || 0) +
      (markRecord?.finalMarks || 0)
    );
    const grade = markRecord ? computeGrade(total) : null;
    return { ...enr, markRecord, total, grade };
  });

  // Calculate summary metrics
  const gradedList = studentsWithMarks.filter((s) => s.markRecord);
  const avgScore =
    gradedList.length > 0
      ? Math.round(gradedList.reduce((acc, s) => acc + s.total, 0) / gradedList.length)
      : 0;
  const highestScore =
    gradedList.length > 0 ? Math.max(...gradedList.map((s) => s.total)) : 0;
  const passRate =
    gradedList.length > 0
      ? Math.round(
          (gradedList.filter((s) => s.grade !== 'F').length / gradedList.length) * 100
        )
      : 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <PageHeader
        title="Academic Performance & Marks"
        subtitle="Manage student coursework evaluation, midterms, and semester finals"
      />

      {/* Course Selector & Quick Stats */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/60 shadow-xs flex flex-wrap gap-4 items-center justify-between">
        <div className="flex-1 min-w-[260px]">
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

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
            Average: {avgScore} / 100
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
            Highest: {highestScore}
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800">
            Pass Rate: {passRate}%
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-100 dark:border-slate-700/60 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={5} cols={7} />
          </div>
        ) : studentsWithMarks.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Icons.Marks}
              title="No enrolled students in this course"
              description="Enroll students in this course curriculum to evaluate their academic marks."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="table-th">Student Name</th>
                  <th className="table-th">Roll Number</th>
                  <th className="table-th">Assignment (20)</th>
                  <th className="table-th">Midterm (30)</th>
                  <th className="table-th">Final Exam (50)</th>
                  <th className="table-th">Total (100)</th>
                  <th className="table-th">Grade</th>
                  <th className="table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {studentsWithMarks.map((s) => (
                  <tr
                    key={s.studentId}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="table-td font-semibold text-slate-800 dark:text-slate-200">
                      {s.studentName}
                    </td>

                    <td className="table-td font-mono text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                      {s.studentStudentId || '—'}
                    </td>

                    <td className="table-td text-xs font-mono">
                      {s.markRecord?.assignmentMarks ?? <span className="text-slate-300">—</span>}
                    </td>

                    <td className="table-td text-xs font-mono">
                      {s.markRecord?.midtermMarks ?? <span className="text-slate-300">—</span>}
                    </td>

                    <td className="table-td text-xs font-mono">
                      {s.markRecord?.finalMarks ?? <span className="text-slate-300">—</span>}
                    </td>

                    <td className="table-td font-bold text-slate-900 dark:text-white font-mono">
                      {s.markRecord ? s.total : <span className="text-slate-300 font-normal">Unrecorded</span>}
                    </td>

                    <td className="table-td">
                      {s.grade ? (
                        <StatusBadge status={s.grade} />
                      ) : (
                        <span className="text-xs text-slate-400 italic">Not Graded</span>
                      )}
                    </td>

                    <td className="table-td text-right space-x-1.5">
                      {s.markRecord ? (
                        <>
                          <button
                            type="button"
                            onClick={() => openEdit(s.markRecord)}
                            className="px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(s.markRecord.id)}
                            className="px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openAdd(s)}
                          className="btn-secondary py-1 px-3 text-xs font-semibold cursor-pointer shadow-2xs"
                        >
                          + Record Marks
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editId ? 'Edit Academic Evaluation' : 'Record Student Marks'}
          subtitle="Input assignment, midterm, and final exam performance scores"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assignment (Max 20)
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  placeholder="0 - 20"
                  value={form.assignmentMarks}
                  onChange={(e) => setForm({ ...form, assignmentMarks: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Midterm (Max 30)
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  step="0.5"
                  placeholder="0 - 30"
                  value={form.midtermMarks}
                  onChange={(e) => setForm({ ...form, midtermMarks: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Final Exam (Max 50)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.5"
                  placeholder="0 - 50"
                  value={form.finalMarks}
                  onChange={(e) => setForm({ ...form, finalMarks: e.target.value })}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Calculated Total:
              </span>
              <span className="font-bold text-sm text-indigo-600 dark:text-indigo-400 font-mono">
                {(Number(form.assignmentMarks) || 0) +
                  (Number(form.midtermMarks) || 0) +
                  (Number(form.finalMarks) || 0)}{' '}
                / 100
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn-secondary text-xs py-2 px-4 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary text-xs py-2 px-5 cursor-pointer shadow-md"
              >
                Save Evaluation
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}