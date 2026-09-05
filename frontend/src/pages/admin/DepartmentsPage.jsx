import { useState, useEffect, useCallback } from 'react';
import { departmentsService } from '../../services/departmentsService';
import { Icons } from '../../components/common/Icons';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const EMPTY = { departmentCode: '', departmentName: '', description: '' };

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState('');

  const fetchDepartments = useCallback(() => {
    setFetching(true);
    departmentsService.getAll()
      .then((r) => setDepartments(r.data.data || []))
      .catch(() => toast.error('Failed to load departments'))
      .finally(() => setFetching(false));
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const openCreate = () => {
    setForm(EMPTY);
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (d) => {
    setForm({
      departmentCode: d.departmentCode,
      departmentName: d.departmentName,
      description: d.description || ''
    });
    setEditId(d.id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await departmentsService.update(editId, form);
        toast.success('Department updated successfully!');
      } else {
        await departmentsService.create(form);
        toast.success('Department created successfully!');
      }
      setShowModal(false);
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    try {
      await departmentsService.delete(id);
      toast.success('Department deleted');
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const filteredDepartments = departments.filter((d) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      d.departmentName?.toLowerCase().includes(q) ||
      d.departmentCode?.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <PageHeader
        title="Academic Departments"
        subtitle={`Faculties, academic schools, and institutional departments (${departments.length} total)`}
        badge={`${departments.length} Departments`}
      >
        <button
          type="button"
          onClick={openCreate}
          className="btn-primary flex items-center gap-1.5 text-xs py-2 px-3.5 shadow-md cursor-pointer"
        >
          <Icons.Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </PageHeader>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/60 shadow-xs flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <Icons.Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search departments by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Grid of Department Cards */}
      {fetching ? (
        <CardSkeleton count={6} />
      ) : filteredDepartments.length === 0 ? (
        <EmptyState
          icon={Icons.Department}
          title="No departments found"
          description="Create your first academic department to organize students, faculty, and courses."
          actionText="Create Department"
          onAction={openCreate}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDepartments.map((d) => (
            <div
              key={d.id}
              className="group bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-xs hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900 shadow-2xs group-hover:scale-110 transition-transform duration-300">
                    <Icons.Department className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300">
                    {d.departmentCode}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {d.departmentName}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {d.description || 'Academic department fostering excellence in higher education and research.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Academic Faculty</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEdit(d)}
                    className="px-2.5 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(d.id)}
                    className="px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editId ? 'Edit Department' : 'Create Academic Department'}
          subtitle={
            editId
              ? 'Update department code and descriptive details'
              : 'Add a new academic discipline or school to the institution'
          }
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CSE, ECE, MECH"
                value={form.departmentCode}
                onChange={(e) => setForm({ ...form, departmentCode: e.target.value.toUpperCase() })}
                className="text-xs font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Computer Science & Engineering"
                value={form.departmentName}
                onChange={(e) => setForm({ ...form, departmentName: e.target.value })}
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description / Overview
              </label>
              <textarea
                rows={3}
                placeholder="Brief description of department scope, research disciplines, and curriculum..."
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
                {loading ? 'Saving...' : editId ? 'Update Department' : 'Create Department'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}