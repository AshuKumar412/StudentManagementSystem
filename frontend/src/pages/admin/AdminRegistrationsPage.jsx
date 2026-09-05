import { useState, useEffect } from 'react';
import { registrationService } from '../../services/registrationService';
import PageHeader from '../../components/common/PageHeader';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { RefreshIcon, CheckIcon, XMarkIcon, UserGroupIcon } from '../../components/common/Icons';
import toast from 'react-hot-toast';

export default function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('PENDING');
  const [filterRole, setFilterRole] = useState('ALL');
  const [selectedItem, setSelectedItem] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await registrationService.getAllRegistrations(filterStatus, filterRole);
      setRegistrations(res.data?.data || []);
    } catch (err) {
      console.error('Failed to load registrations:', err);
      toast.error(err.friendlyMessage || 'Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [filterStatus, filterRole]);

  const handleApprove = async (id) => {
    if (!window.confirm('Are you sure you want to approve this registration?')) return;
    setActionLoading(true);
    try {
      await registrationService.approveRegistration(id);
      toast.success('Registration approved successfully!');
      fetchRegistrations();
    } catch (err) {
      console.error('Approval failed:', err);
      toast.error(err.friendlyMessage || 'Failed to approve registration');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedItem) return;
    if (!rejectionReason.trim()) {
      toast.error('Please specify a rejection reason.');
      return;
    }
    setActionLoading(true);
    try {
      await registrationService.rejectRegistration(selectedItem.id, rejectionReason.trim());
      toast.success('Registration rejected.');
      setSelectedItem(null);
      setRejectionReason('');
      fetchRegistrations();
    } catch (err) {
      console.error('Rejection failed:', err);
      toast.error(err.friendlyMessage || 'Failed to reject registration');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
      case 'ACTIVE':
        return <span className="badge-green">Approved</span>;
      case 'REJECTED':
        return <span className="badge-red">Rejected</span>;
      case 'PENDING':
      default:
        return <span className="badge-amber">Pending Review</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="User Registration Queue"
        subtitle="Review, approve, and manage incoming student & faculty account requests"
        badge={`${registrations.length} Applications`}
        actions={
          <button
            onClick={fetchRegistrations}
            className="btn-secondary text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshIcon className="w-3.5 h-3.5" />
            Refresh Queue
          </button>
        }
      />

      {/* Filter Toolbar */}
      <div className="card p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
              Application Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field text-xs py-1.5 px-3"
            >
              <option value="PENDING">Pending Review</option>
              <option value="APPROVED">Approved / Active</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
              Role Type
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="input-field text-xs py-1.5 px-3"
            >
              <option value="ALL">All Roles</option>
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Faculty / Teacher</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-[var(--text-muted)]">
          Displaying <span className="font-semibold text-[var(--text-primary)]">{registrations.length}</span> records
        </div>
      </div>

      {/* Data Table */}
      <div className="table-container">
        {loading ? (
          <TableSkeleton rows={5} cols={7} />
        ) : registrations.length === 0 ? (
          <EmptyState
            icon={UserGroupIcon}
            title="No registration applications found"
            description="There are currently no accounts matching the selected status and role filters."
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Role</th>
                <th>Contact</th>
                <th>Department</th>
                <th>Status</th>
                <th>Submission Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg.id}>
                  <td>
                    <div className="font-semibold text-[var(--text-primary)]">{reg.name}</div>
                    <div className="text-xs text-[var(--text-muted)]">{reg.email}</div>
                  </td>
                  <td>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      reg.role === 'STUDENT'
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/50'
                        : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/50'
                    }`}>
                      {reg.role === 'STUDENT' ? '👨‍🎓 Student' : '👨‍🏫 Faculty'}
                    </span>
                  </td>
                  <td className="text-xs text-[var(--text-secondary)]">
                    {reg.phone || '—'}
                  </td>
                  <td className="text-xs font-medium text-[var(--text-secondary)]">
                    {reg.department || '—'}
                  </td>
                  <td>
                    <div className="space-y-1">
                      {getStatusBadge(reg.status)}
                      {reg.rejectionReason && (
                        <div className="text-[11px] text-rose-600 dark:text-rose-400 max-w-xs truncate" title={reg.rejectionReason}>
                          Reason: {reg.rejectionReason}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="text-xs text-[var(--text-muted)]">
                    {reg.registrationDate ? new Date(reg.registrationDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="text-right space-x-2">
                    {reg.status === 'PENDING' ? (
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(reg.id)}
                          disabled={actionLoading}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <CheckIcon className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => { setSelectedItem(reg); setRejectionReason(''); }}
                          disabled={actionLoading}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <XMarkIcon className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-[var(--text-muted)] italic">Resolved</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Rejection Modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title="Reject Registration Application"
        subtitle={`Applicant: ${selectedItem?.name} (${selectedItem?.email})`}
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-[var(--text-secondary)]">
            Please provide an official explanation for rejecting this account request. This will be recorded on their application profile.
          </p>
          <div>
            <label className="block text-xs font-semibold text-[var(--text-primary)] mb-1.5">
              Reason for Rejection *
            </label>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Unrecognized identity credentials, invalid department assignment..."
              className="input-field"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="btn-secondary text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReject}
              disabled={actionLoading}
              className="btn-danger text-xs flex items-center gap-1.5 cursor-pointer"
            >
              {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}