import { useState, useEffect, useCallback } from 'react';
import { teachersService } from '../../services/teachersService';
import { departmentsService } from '../../services/departmentsService';
import { Icons } from '../../components/common/Icons';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const EMPTY = { teacherId: '', name: '', email: '', phone: '', departmentId: '', password: '' };

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 0, totalPages: 0, totalElements: 0 });
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [page, setPage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchTeachers = useCallback(() => {
    setFetching(true);
    const params = { page, size: 10 };
    if (search) params.search = search;
    if (deptFilter) params.departmentId = deptFilter;
    teachersService.getAll(params)
      .then((r) => {
        setTeachers(r.data.data.content || []);
        setPagination({
          currentPage: r.data.data.currentPage,
          totalPages: r.data.data.totalPages,
          totalElements: r.data.data.totalElements
        });
      })
      .catch(() => toast.error('Failed to load faculty directory'))
      .finally(() => setFetching(false));
  }, [page, search, deptFilter]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  useEffect(() => {
    departmentsService.getAll().then((r) => setDepartments(r.data.data || []));
  }, []);

  const openCreate = () => {
    setForm(EMPTY);
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (t) => {
    setForm({
      teacherId: t.teacherId,
      name: t.name,
      email: t.email,
      phone: t.phone || '',
      departmentId: t.departmentId || '',
      password: ''
    });
    setEditId(t.id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, departmentId: form.departmentId ? Number(form.departmentId) : null };
      if (editId) {
        await teachersService.update(editId, payload);
        toast.success('Faculty member updated!');
      } else {
        await teachersService.create(payload);
        toast.success('Faculty member registered!');
      }
      setShowModal(false);
      fetchTeachers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this faculty member?')) return;
    try {
      await teachersService.delete(id);
      toast.success('Faculty member removed');
      fetchTeachers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <PageHeader
        title="Faculty Members"
        subtitle={`Directory of professors, lecturers, and academic instructors (${pagination.totalElements} records)`}
        badge={`${pagination.totalElements} Faculty`}
      >
        <button
          type="button"
          onClick={openCreate}
          className="btn-primary flex items-center gap-1.5 text-xs py-2 px-3.5 shadow-md cursor-pointer"
        >
          <Icons.Plus className="w-4 h-4" />
          <span>Add Faculty</span>
        </button>
      </PageHeader>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/60 shadow-xs flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[240px] relative">
          <Icons.Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search faculty by name, employee ID, or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="pl-9 text-xs"
          />
        </div>

        <div className="w-56">
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

        {(search || deptFilter) && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setDeptFilter('');
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
            <TableSkeleton rows={6} cols={5} />
          </div>
        ) : teachers.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Icons.Teacher}
              title="No faculty members found"
              description="Try adjusting your department filter or add a new faculty instructor."
              actionText="Add Faculty"
              onAction={openCreate}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="table-th">Instructor</th>
                  <th className="table-th">Faculty ID</th>
                  <th className="table-th">Department</th>
                  <th className="table-th">Contact Info</th>
                  <th className="table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {teachers.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="table-td flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs shrink-0">
                        {t.name?.[0] || 'T'}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{t.name}</div>
                        <div className="text-xs text-slate-400">{t.email}</div>
                      </div>
                    </td>

                    <td className="table-td font-mono text-xs font-semibold text-purple-600 dark:text-purple-400">
                      {t.teacherId}
                    </td>

                    <td className="table-td text-xs font-medium text-slate-700 dark:text-slate-300">
                      <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                        {t.departmentName || 'General Faculty'}
                      </span>
                    </td>

                    <td className="table-td text-xs text-slate-500 dark:text-slate-400">
                      {t.phone || '—'}
                    </td>

                    <td className="table-td text-right space-x-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(t)}
                        className="px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(t.id)}
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
          title={editId ? 'Edit Faculty Record' : 'Register New Faculty'}
          subtitle={
            editId
              ? 'Update faculty credentials and department assignment'
              : 'Add an academic instructor to the institution faculty'
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Faculty / Staff ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FAC-102"
                  value={form.teacherId}
                  onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Department
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

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Prof. Rajesh Sharma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="faculty@sms.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="text-xs"
                />
              </div>

              {!editId && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="text-xs"
                  />
                </div>
              )}
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
                {loading ? 'Saving...' : editId ? 'Update Record' : 'Register Faculty'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}