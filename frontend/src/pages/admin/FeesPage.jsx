import { useState, useEffect, useCallback } from 'react';
import { feesService } from '../../services/feesService';
import { studentsService } from '../../services/studentsService';
import { Icons } from '../../components/common/Icons';
import PageHeader from '../../components/common/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const EMPTY = {
  studentId: '',
  amount: '',
  paidAmount: 0,
  dueDate: '',
  paymentDate: ''
};

export default function FeesPage() {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchFees = useCallback(() => {
    setFetching(true);
    feesService.getAll()
      .then((r) => setFees(r.data.data || []))
      .catch(() => toast.error('Failed to load fee ledger'))
      .finally(() => setFetching(false));
  }, []);

  useEffect(() => {
    fetchFees();
    studentsService.getAll({ size: 200 }).then((r) => setStudents(r.data.data?.content || []));
  }, [fetchFees]);

  const openCreate = () => {
    setForm(EMPTY);
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (f) => {
    setForm({
      studentId: f.studentId,
      amount: f.amount,
      paidAmount: f.paidAmount || 0,
      dueDate: f.dueDate || '',
      paymentDate: f.paymentDate || ''
    });
    setEditId(f.id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        studentId: Number(form.studentId),
        amount: Number(form.amount),
        paidAmount: Number(form.paidAmount || 0),
        dueDate: form.dueDate,
        paymentDate: form.paymentDate || null
      };

      if (editId) {
        await feesService.update(editId, payload);
        toast.success('Fee record updated!');
      } else {
        await feesService.create(payload);
        toast.success('Fee record registered!');
      }
      setShowModal(false);
      fetchFees();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this fee record?')) return;
    try {
      await feesService.delete(id);
      toast.success('Fee record removed');
      fetchFees();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  // Metrics calculations
  const totalInvoiced = fees.reduce((acc, f) => acc + Number(f.amount || 0), 0);
  const totalCollected = fees.reduce((acc, f) => acc + Number(f.paidAmount || 0), 0);
  const totalOutstanding = Math.max(0, totalInvoiced - totalCollected);
  const collectionRate = totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0;

  const filteredFees = fees.filter((f) => {
    if (statusFilter && f.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const name = f.studentName?.toLowerCase() || '';
      const sid = f.studentStudentId?.toLowerCase() || '';
      return name.includes(q) || sid.includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <PageHeader
        title="Tuition & Fee Ledger"
        subtitle="Manage student fee structures, collection accounts, and payment milestones"
        badge={`${fees.length} Invoices`}
      >
        <button
          type="button"
          onClick={openCreate}
          className="btn-primary flex items-center gap-1.5 text-xs py-2 px-3.5 shadow-md cursor-pointer"
        >
          <Icons.Plus className="w-4 h-4" />
          <span>New Fee Invoice</span>
        </button>
      </PageHeader>

      {/* 4 Financial Progress Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-xs">
          <p className="text-xs font-semibold text-slate-400 uppercase">Total Invoiced</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            ₹{totalInvoiced.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Total tuition assessment</p>
        </div>

        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-xs">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase">Collected</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            ₹{totalCollected.toLocaleString()}
          </p>
          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${collectionRate}%` }} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-xs">
          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase">Pending Due</p>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            ₹{totalOutstanding.toLocaleString()}
          </p>
          <p className="text-[11px] text-rose-500 mt-1">Awaiting collection</p>
        </div>

        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/60 shadow-xs">
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase">Collection Efficiency</p>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
            {collectionRate}%
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Of total assessed fees</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/60 shadow-xs flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[240px] relative">
          <Icons.Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="w-44">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs"
          >
            <option value="">All Statuses</option>
            <option value="PAID">Paid in Full</option>
            <option value="PENDING">Pending Balance</option>
            <option value="OVERDUE">Overdue Notice</option>
          </select>
        </div>

        {(search || statusFilter) && (
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setStatusFilter('');
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
            <TableSkeleton rows={5} cols={7} />
          </div>
        ) : filteredFees.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Icons.Fees}
              title="No fee records found"
              description="Create a tuition fee schedule to begin tracking receipts and balances."
              actionText="New Fee Invoice"
              onAction={openCreate}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="table-th">Student</th>
                  <th className="table-th">Roll Number</th>
                  <th className="table-th">Total Assessed</th>
                  <th className="table-th">Amount Paid</th>
                  <th className="table-th">Remaining Due</th>
                  <th className="table-th">Due Date</th>
                  <th className="table-th">Status</th>
                  <th className="table-th text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {filteredFees.map((f) => {
                  const rem = Math.max(0, (f.amount || 0) - (f.paidAmount || 0));
                  return (
                    <tr
                      key={f.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="table-td font-semibold text-slate-800 dark:text-slate-200">
                        {f.studentName}
                      </td>

                      <td className="table-td font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {f.studentStudentId || '—'}
                      </td>

                      <td className="table-td font-mono font-semibold text-slate-900 dark:text-white">
                        ₹{Number(f.amount || 0).toLocaleString()}
                      </td>

                      <td className="table-td font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        ₹{Number(f.paidAmount || 0).toLocaleString()}
                      </td>

                      <td className="table-td font-mono font-semibold text-rose-600 dark:text-rose-400">
                        ₹{rem.toLocaleString()}
                      </td>

                      <td className="table-td text-xs text-slate-500 dark:text-slate-400">
                        {f.dueDate ? new Date(f.dueDate).toLocaleDateString() : '—'}
                      </td>

                      <td className="table-td">
                        <StatusBadge status={f.status} />
                      </td>

                      <td className="table-td text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() => openEdit(f)}
                          className="px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg transition-colors cursor-pointer"
                        >
                          Update Payment
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(f.id)}
                          className="px-2.5 py-1 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-lg transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
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
          title={editId ? 'Update Fee Record' : 'Create Tuition Invoice'}
          subtitle={
            editId
              ? 'Update payment receipt or due date for this student'
              : 'Issue an institutional tuition assessment for a student'
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
                    {s.firstName} {s.lastName} ({s.studentId})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Total Assessment (₹) *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  placeholder="e.g. 50000"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Amount Paid So Far (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 25000"
                  value={form.paidAmount}
                  onChange={(e) => setForm({ ...form, paidAmount: e.target.value })}
                  className="text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Last Payment Date
                </label>
                <input
                  type="date"
                  value={form.paymentDate}
                  onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
                  className="text-xs"
                />
              </div>
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
                {loading ? 'Saving...' : editId ? 'Update Record' : 'Issue Invoice'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}