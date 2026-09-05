import { useState, useEffect, useCallback } from 'react';
import { enrollmentService } from '../../services/enrollmentService';
import { studentsService } from '../../services/studentsService';
import { coursesService } from '../../services/coursesService';
import { Icons } from '../../components/common/Icons';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = [
  { value: 'ENROLLED', label: 'Enrolled', description: 'Student registered and pending term start' },
  { value: 'ACTIVE', label: 'Active', description: 'Currently attending classes and lectures' },
  { value: 'COMPLETED', label: 'Completed', description: 'Successfully finished course curriculum' },
  { value: 'DROPPED', label: 'Dropped', description: 'Withdrawn or discontinued from course' }
];

const EMPTY_FORM = {
  studentId: '',
  courseId: '',
  enrollmentDate: new Date().toISOString().split('T')[0],
  status: 'ENROLLED'
};

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studentFilter, setStudentFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchEnrollments = useCallback(() => {
    setFetching(true);
    const params = {};
    if (studentFilter) params.studentId = studentFilter;
    if (courseFilter) params.courseId = courseFilter;
    enrollmentService.getAll(params)
      .then((r) => setEnrollments(r.data.data || []))
      .catch((err) => {
        const msg = err.friendlyMessage || err.response?.data?.message || 'Failed to load enrollments';
        toast.error(msg);
      })
      .finally(() => setFetching(false));
  }, [studentFilter, courseFilter]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  useEffect(() => {
    studentsService.getAll({ size: 300 }).then((r) => setStudents(r.data.data?.content || []));
    coursesService.getAll({ size: 300 }).then((r) => setCourses(r.data.data?.content || []));
  }, []);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (e) => {
    setForm({
      studentId: e.studentId,
      courseId: e.courseId,
      enrollmentDate: e.enrollmentDate || new Date().toISOString().split('T')[0],
      status: e.status || 'ENROLLED'
    });
    setEditId(e.id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.studentId || !form.courseId) {
      toast.error('Please select both a student and a course.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        studentId: Number(form.studentId),
        courseId: Number(form.courseId),
        enrollmentDate: form.enrollmentDate,
        status: form.status
      };

      if (editId) {
        await enrollmentService.update(editId, payload);
        toast.success('Enrollment status updated!');
      } else {
        await enrollmentService.create(payload);
        toast.success('Student enrolled successfully!');
      }
      setShowModal(false);
      fetchEnrollments();
    } catch (err) {
      const msg = err.friendlyMessage || err.response?.data?.message || 'Unable to save enrollment.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this course enrollment record?')) return;
    try {
      await enrollmentService.delete(id);
      toast.success('Enrollment record removed');
      fetchEnrollments();
    } catch (err) {
      toast.error(err.friendlyMessage || err.response?.data?.message || 'Delete failed');
    }
  };

  const filteredEnrollments = enrollments.filter((e) => {
    if (statusFilter && e.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <PageHeader
        title="Course Enrollments"
        subtitle={`Track student course registrations and academic status transitions (${filteredEnrollments.length} total)`}
        badge={`${filteredEnrollments.length} Enrollments`}
      >
        <button
          type="button"
          onClick={openCreate}
          className="btn-primary flex items-center gap-1.5 text-xs py-2 px-3.5 shadow-md cursor-pointer"
        >
          <Icons.Plus className="w-4 h-4" />
          <span>Enroll Student</span>
        </button>
      </PageHeader>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/60 shadow-xs flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Filter by Student
          </label>
          <select
            value={studentFilter}
            onChange={(e) => setStudentFilter(e.target.value)}
            className="text-xs"
          >
            <option value="">All Students</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.firstName} {s.lastName} ({s.studentId})
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Filter by Course
          </label>
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="text-xs"
          >
            <option value="">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.courseCode} - {c.courseName}
              </option>
            ))}
          </select>
        </div>

        <div className="w-44">
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
            Enrollment Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {(studentFilter || courseFilter || statusFilter) && (
          <button
            type="button"
            onClick={() => {
              setStudentFilter('');
              setCourseFilter('');
              setStatusFilter('');
            }}
            className="self-end pb-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-100 dark:border-slate-700/60 overflow-hidden shadow-xs">
        {fetching ? (
          <div className="p-6">
            <TableSkeleton rows={6} cols={5} />
          </div>
        ) : filteredEnrollments.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Icons.Enrollments}
              title="No course enrollments found"
              description="Enroll a registered student in their semester curriculum to begin tracking."
              actionText="Enroll Student"
              onAction={openCreate}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="table-th">Student Name</th>
                  <th className="table-th">Roll Number</th>
                  <th className="table-th">Enrolled Course</th>
                  <th className="table-th">Enrollment Date</th>
                  <th className="table-th">Status</th>
                  <th className="table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {filteredEnrollments.map((e) => (
                  <tr
                    key={e.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="table-td font-semibold text-slate-900 dark:text-white">
                      {e.studentName}
                    </td>

                    <td className="table-td font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {e.studentStudentId || '—'}
                    </td>

                    <td className="table-td">
                      <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 mr-2">
                        {e.courseCode}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400 text-xs">
                        {e.courseName}
                      </span>
                    </td>

                    <td className="table-td text-xs text-slate-500 dark:text-slate-400">
                      {e.enrollmentDate ? new Date(e.enrollmentDate).toLocaleDateString() : '—'}
                    </td>

                    <td className="table-td">
                      <StatusBadge status={e.status} />
                    </td>

                    <td className="table-td text-right space-x-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(e)}
                        className="px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors cursor-pointer"
                      >
                        Change Status
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(e.id)}
                        className="px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
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
          title={editId ? 'Update Enrollment Status' : 'Enroll Student in Course'}
          subtitle={
            editId
              ? 'Modify the current enrollment state and completion date'
              : 'Register a student for course curriculum attendance and grades'
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select Student *
              </label>
              <select
                required
                disabled={!!editId}
                value={form.studentId}
                onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                className="text-xs"
              >
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.firstName} {s.lastName} ({s.studentId}) - {s.departmentName || 'General'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select Course *
              </label>
              <select
                required
                disabled={!!editId}
                value={form.courseId}
                onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                className="text-xs"
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.courseCode} - {c.courseName} ({c.credits} Credits, Sem {c.semester})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Enrollment Date *
                </label>
                <input
                  type="date"
                  required
                  value={form.enrollmentDate}
                  onChange={(e) => setForm({ ...form, enrollmentDate: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Enrollment Status *
                </label>
                <select
                  required
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="text-xs"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label} ({opt.value})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status Information Callout */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-700/80 text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Enrollment Workflow Guide:
              </span>
              <p>• <strong className="text-blue-600 dark:text-blue-400">Enrolled:</strong> Seat registered, pending commencement of lectures.</p>
              <p>• <strong className="text-emerald-600 dark:text-emerald-400">Active:</strong> Actively attending and participating in the class.</p>
              <p>• <strong className="text-purple-600 dark:text-purple-400">Completed:</strong> Finished course curriculum and final examinations.</p>
              <p>• <strong className="text-rose-600 dark:text-rose-400">Dropped:</strong> Withdrawn before credit completion.</p>
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
                disabled={loading}
                className="btn-primary text-xs py-2 px-5 cursor-pointer shadow-md"
              >
                {loading ? 'Saving Enrollment...' : editId ? 'Update Status' : 'Confirm Enrollment'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}