import { useState, useEffect } from 'react';
import { studentsService } from '../../services/studentsService';
import { feesService } from '../../services/feesService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function StudentFees() {
  const { user } = useAuth();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      studentsService.getAll({ search: user.email })
        .then(res => {
          const list = res.data.data?.content || [];
          if (list.length > 0) {
            const student = list[0];
            return feesService.getByStudent(student.id);
          }
          return { data: { data: [] } };
        })
        .then(r => setFees(r.data.data || []))
        .catch(() => toast.error('Failed to load fee information'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const statusBadge = (s) => {
    const cls = { PAID: 'badge-green', PARTIAL: 'badge-yellow', PENDING: 'badge-red', OVERDUE: 'badge-red' };
    return <span className={cls[s] || 'badge-gray'}>{s}</span>;
  };

  const totalAmount = fees.reduce((acc, f) => acc + (Number(f.amount) || 0), 0);
  const totalPaid = fees.reduce((acc, f) => acc + (Number(f.paidAmount) || 0), 0);
  const totalDue = fees.reduce((acc, f) => acc + (Number(f.dueAmount) || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Fee Status & Payments</h1>
        <p className="text-gray-500 text-sm mt-1">Review semester fee statements, dues, and payment transactions.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-blue-50 border-blue-200">
          <p className="text-xs font-semibold text-blue-700">TOTAL BILLED</p>
          <p className="text-3xl font-bold text-blue-900 mt-1">₹{totalAmount.toLocaleString()}</p>
        </div>
        <div className="card bg-green-50 border-green-200">
          <p className="text-xs font-semibold text-green-700">AMOUNT PAID</p>
          <p className="text-3xl font-bold text-green-900 mt-1">₹{totalPaid.toLocaleString()}</p>
        </div>
        <div className="card bg-red-50 border-red-200">
          <p className="text-xs font-semibold text-red-700">PENDING BALANCE</p>
          <p className="text-3xl font-bold text-red-900 mt-1">₹{totalDue.toLocaleString()}</p>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Invoice / Fee ID', 'Total Amount', 'Paid Amount', 'Due Balance', 'Due Date', 'Payment Date', 'Status'].map(h => (
                <th key={h} className="table-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {fees.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">No fee records found</td></tr>
            ) : (
              fees.map(f => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="table-td font-mono text-xs">FEE-#{f.id}</td>
                  <td className="table-td font-semibold">₹{Number(f.amount).toLocaleString()}</td>
                  <td className="table-td text-green-600 font-medium">₹{Number(f.paidAmount || 0).toLocaleString()}</td>
                  <td className="table-td text-red-600 font-medium">₹{Number(f.dueAmount || 0).toLocaleString()}</td>
                  <td className="table-td text-gray-500">{f.dueDate || '—'}</td>
                  <td className="table-td text-gray-500">{f.paymentDate || '—'}</td>
                  <td className="table-td">{statusBadge(f.paymentStatus)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
