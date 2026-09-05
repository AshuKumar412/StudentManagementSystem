import { useState, useEffect, useCallback } from 'react';
import { coursesService } from '../../services/coursesService';
import { departmentsService } from '../../services/departmentsService';
import { teachersService } from '../../services/teachersService';
import { Icons } from '../../components/common/Icons';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const EMPTY = {
  courseCode: '',
  courseName: '',
  description: '',
  credits: 3,
  semester: 1,
  departmentId: '',
  teacherId: ''
};

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 0, totalPages: 0, totalElements: 0 });
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('');
  const [page, setPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchCourses = useCallback(() => {
    setFetching(true);
    const params = { page, size: 10 };
    if (search) params.search = search;
    if (deptFilter) params.departmentId = deptFilter;
    if (teacherFilter) params.teacherId = teacherFilter;
    coursesService.getAll(params)
      .then((r) => {
        setCourses(r.data.data.content || []);
        setPagination({
          currentPage: r.data.data.currentPage,
          totalPages: r.data.data.totalPages,
          totalElements: r.data.data.totalElements
        });
      })
      .catch(() => toast.error('Failed to load courses'))
      .finally(() => setFetching(false));
  }, [page, search, deptFilter, teacherFilter]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    departmentsService.getAll().then((r) => setDepartments(r.data.data || []));
    teachersService.getAll({ size: 100 }).then((r) => setTeachers(r.data.data?.content || []));
  }, []);

  const openCreate = () => {
    setForm(EMPTY);
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (c) => {
    setForm({
      courseCode: c.courseCode,
      courseName: c.courseName,
      description: c.description || '',
      credits: c.credits || 3,
      semester: c.semester || 1,
      departmentId: c.departmentId || '',
      teacherId: c.teacherId || ''
    });
    setEditId(c.id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        credits: Number(form.credits),
        semester: Number(form.semester),
        departmentId: form.departmentId ? Number(form.departmentId) : null,
        teacherId: form.teacherId ? Number(form.teacherId) : null
      };

      if (editId) {
        await coursesService.update(editId, payload);
        toast.success('Course updated successfully!');
      } else {
        await coursesService.create(payload);
        toast.success('Course added to curriculum!');
      }
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this course from curriculum?')) return;
    try {
      await coursesService.delete(id);
      toast.success('Course deleted');
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <PageHeader
        title="Course Curriculum"
        subtitle={`Academic subjects, credit allocations, and faculty assignments (${pagination.totalElements} courses)`}
        badge={`${pagination.totalElements} Courses`}
      >
        <button
          type="button"
          onClick={openCreate}
          className="btn-primary flex items-center gap-1.5 text-xs py-2 px-3.5 shadow-md cursor-pointer"
        >
          <Icons.Plus className="w-4 h-4" />
          <span>Add Course</span>
        </button>
      </PageHeader>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/60 shadow-xs flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[240px] relative">
          <Icons.Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courses by code or title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="pl-9 text-xs"
          />
        </div>

        <div className="w-48">
          <select
            value={deptFilter}
            onChange={(e) => {
              setDeptFilter(e.target.value);
              setPage(0);
            }}
            className="text-xs"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.departmentName}
              </option>
            ))}
          </select>
        </div>

        <div className="w-48">
          <select
            value={teacherFilter}
            onChange={(e) => {
              setTeacherFilter(e.target.value);
              setPage(0);
            }}
            className="text-xs"
          >
            <option value="">All Instructors</option>
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {(search || deptFilter || teacherFilter) && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setDeptFilter('');
              setTeacherFilter('');
              setPage(0);
            }}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline px-2 py-1 cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-100 dark:border-slate-700/60 overflow-hidden shadow-xs">
        {fetching ? (
          <div className="p-6">
            <TableSkeleton rows={6} cols={6} />
          </div>
        ) : courses.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Icons.Courses}
              title="No courses registered"
              description="Begin building your curriculum by adding your first academic course."
              actionText="Add Course"
              onAction={openCreate}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="table-th">Course Code</th>
                  <th className="table-th">Course Title</th>
                  <th className="table-th">Department</th>
                  <th className="table-th">Assigned Faculty</th>
                  <th className="table-th">Credits</th>
                  <th className="table-th">Semester</th>
                  <th className="table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {courses.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="table-td font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {c.courseCode}
                    </td>

                    <td className="table-td">
                      <div className="font-semibold text-slate-900 dark:text-white">{c.courseName}</div>
                      {c.description && (
                        <div className="text-xs text-slate-400 truncate max-w-xs">{c.description}</div>
                      )}
                    </td>

                    <td className="table-td text-xs text-slate-700 dark:text-slate-300 font-medium">
                      {c.departmentName || '—'}
                    </td>

                    <td className="table-td text-xs text-slate-600 dark:text-slate-300">
                      {c.teacherName ? (
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          <Icons.Teacher className="w-3.5 h-3.5 text-indigo-500" />
                          {c.teacherName}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="table-td">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                        {c.credits} Credits
                      </span>
                    </td>

                    <td className="table-td text-xs text-slate-600 dark:text-slate-400 font-medium">
                      Semester {c.semester}
                    </td>

                    <td className="table-td text-right space-x-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(c)}
                        className="px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id)}
                        className="px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Showing Page {page + 1} of {pagination.totalPages} ({pagination.totalElements} records)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="btn-secondary text-xs py-1.5 px-3 disabled:opacity-40"
              >
                ← Previous
              </button>
              <button
                disabled={page + 1 >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="btn-secondary text-xs py-1.5 px-3 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editId ? 'Edit Course Details' : 'Add New Course'}
          subtitle={
            editId
              ? 'Update course metadata, credit hours, and assigned faculty'
              : 'Add a new subject to the institutional degree curriculum'
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Course Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS-301"
                  value={form.courseCode}
                  onChange={(e) => setForm({ ...form, courseCode: e.target.value.toUpperCase() })}
                  className="text-xs font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Database Management Systems"
                  value={form.courseName}
                  onChange={(e) => setForm({ ...form, courseName: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department
                </label>
                <select
                  value={form.departmentId}
                  onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                  className="text-xs"
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.departmentName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Instructor
                </label>
                <select
                  value={form.teacherId}
                  onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                  className="text-xs"
                >
                  <option value="">Select Faculty (Optional)</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.departmentName || 'General'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Credits
                </label>
                <select
                  value={form.credits}
                  onChange={(e) => setForm({ ...form, credits: e.target.value })}
                  className="text-xs"
                >
                  {[1, 2, 3, 4, 5, 6].map((cr) => (
                    <option key={cr} value={cr}>
                      {cr} Credits
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Semester Offering
                </label>
                <select
                  value={form.semester}
                  onChange={(e) => setForm({ ...form, semester: e.target.value })}
                  className="text-xs"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Course Syllabus Overview
              </label>
              <textarea
                rows={3}
                placeholder="Key topics, lecture modules, and learning outcomes..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="text-xs"
              />
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
                {loading ? 'Saving Course...' : editId ? 'Update Course' : 'Register Course'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}