import { useState, useEffect } from 'react';
import { studentsService } from '../../services/studentsService';
import { marksService } from '../../services/marksService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function StudentResults() {
  const { user } = useAuth();
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      studentsService.getAll({ search: user.email })
        .then(res => {
          const list = res.data.data?.content || [];
          if (list.length > 0) {
            const student = list[0];
            return marksService.getByStudent(student.id);
          }
          return { data: { data: [] } };
        })
        .then(r => setMarks(r.data.data || []))
        .catch(() => toast.error('Failed to load marks & results'))
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

  const getGradeBadge = (grade) => {
    if (!grade) return <span className="badge-gray">—</span>;
    if (grade.startsWith('A')) return <span className="badge-green">{grade}</span>;
    if (grade.startsWith('B')) return <span className="badge-blue">{grade}</span>;
    if (grade.startsWith('C')) return <span className="badge-yellow">{grade}</span>;
    return <span className="badge-red">{grade}</span>;
  };

  const scoredMarks = marks.filter(m => m.percentage != null);
  const avgPct = scoredMarks.length > 0
    ? (scoredMarks.reduce((acc, m) => acc + m.percentage, 0) / scoredMarks.length).toFixed(1)
    : '—';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Academic Results & Grades</h1>
        <p className="text-gray-500 text-sm mt-1">Review your performance in assignments, midterms, and final examinations.</p>
      </div>

      {/* Summary Scorecard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-indigo-50 border-indigo-200">
          <p className="text-xs font-semibold text-indigo-700">COURSES EVALUATED</p>
          <p className="text-3xl font-bold text-indigo-900 mt-1">{scoredMarks.length}</p>
        </div>
        <div className="card bg-purple-50 border-purple-200">
          <p className="text-xs font-semibold text-purple-700">AVERAGE SCORE</p>
          <p className="text-3xl font-bold text-purple-900 mt-1">{avgPct}%</p>
        </div>
        <div className="card bg-emerald-50 border-emerald-200">
          <p className="text-xs font-semibold text-emerald-700">STATUS</p>
          <p className="text-2xl font-bold text-emerald-900 mt-1">
            {Number(avgPct) >= 50 || avgPct === '—' ? 'In Good Standing' : 'Needs Improvement'}
          </p>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Course Name', 'Assignment (20)', 'Midterm (30)', 'Final Exam (50)', 'Total Score (100)', 'Percentage', 'Grade'].map(h => (
                <th key={h} className="table-th text-center">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {marks.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">No marks published yet</td></tr>
            ) : (
              marks.map(m => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="table-td font-medium text-left">{m.courseName}</td>
                  <td className="table-td text-center">{m.assignmentMarks ?? '—'}</td>
                  <td className="table-td text-center">{m.midtermMarks ?? '—'}</td>
                  <td className="table-td text-center">{m.finalMarks ?? '—'}</td>
                  <td className="table-td text-center font-bold text-gray-900">{m.totalMarks ?? '—'}</td>
                  <td className="table-td text-center font-semibold text-indigo-600">
                    {m.percentage != null ? `${m.percentage.toFixed(1)}%` : '—'}
                  </td>
                  <td className="table-td text-center">{getGradeBadge(m.grade)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
