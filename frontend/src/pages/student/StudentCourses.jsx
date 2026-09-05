import { useState, useEffect } from 'react';
import { studentsService } from '../../services/studentsService';
import { enrollmentService } from '../../services/enrollmentService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function StudentCourses() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      studentsService.getAll({ search: user.email })
        .then(res => {
          const list = res.data.data?.content || [];
          if (list.length > 0) {
            const student = list[0];
            return enrollmentService.getAll({ studentId: student.id });
          }
          return { data: { data: [] } };
        })
        .then(r => setEnrollments(r.data.data || []))
        .catch(() => toast.error('Failed to load enrolled courses'))
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Registered Courses</h1>
        <p className="text-gray-500 text-sm mt-1">All courses you are currently enrolled in for this semester.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.length === 0 ? (
          <div className="col-span-full card text-center py-10 text-gray-400">
            You are not enrolled in any courses yet.
          </div>
        ) : (
          enrollments.map(e => (
            <div key={e.id} className="card flex flex-col justify-between hover:shadow-md transition-shadow border-t-4 border-indigo-500">
              <div>
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded">
                    {e.courseCode}
                  </span>
                  <span className="badge-green">{e.status}</span>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mt-3">{e.courseName}</h3>
                <p className="text-xs text-gray-500 mt-2">
                  Enrolled On: <span className="font-medium text-gray-700">{e.enrollmentDate || '—'}</span>
                </p>
              </div>

              <div className="mt-4 pt-3 border-t flex justify-between items-center text-xs text-gray-500">
                <span>Student ID: <b className="text-gray-700">{e.studentStudentId}</b></span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
