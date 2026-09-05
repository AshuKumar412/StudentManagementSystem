import { useState, useEffect } from 'react';
import { coursesService } from '../../services/coursesService';
import { enrollmentService } from '../../services/enrollmentService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function TeacherCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rosterLoading, setRosterLoading] = useState(false);

  useEffect(() => {
    // Fetch all courses and match teacher by name or teacherId
    coursesService.getAll({ size: 100 })
      .then(r => {
        const list = r.data.data?.content || [];
        // Filter courses where teacherName matches or teacher is assigned
        const myCourses = list.filter(c => c.teacherName === user?.name || !user?.name);
        setCourses(myCourses.length > 0 ? myCourses : list);
      })
      .catch(() => toast.error('Failed to load courses'))
      .finally(() => setLoading(false));
  }, [user]);

  const viewRoster = (course) => {
    setSelectedCourse(course);
    setRosterLoading(true);
    enrollmentService.getAll({ courseId: course.id })
      .then(r => setRoster(r.data.data || []))
      .catch(() => toast.error('Failed to load student roster'))
      .finally(() => setRosterLoading(false));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
        <p className="text-gray-500 text-sm mt-1">Courses assigned to you for teaching and evaluation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length === 0 ? (
          <div className="col-span-full card text-center py-10 text-gray-400">
            No courses assigned yet.
          </div>
        ) : (
          courses.map(course => (
            <div key={course.id} className="card flex flex-col justify-between hover:shadow-md transition-shadow border-t-4 border-emerald-500">
              <div>
                <div className="flex justify-between items-start">
                  <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded">
                    {course.courseCode}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    Sem {course.semester} • {course.credits} Credits
                  </span>
                </div>
                <h3 className="font-bold text-lg text-gray-800 mt-3">{course.courseName}</h3>
                <p className="text-sm text-gray-500 mt-1">{course.departmentName || 'General Department'}</p>
                {course.description && (
                  <p className="text-xs text-gray-400 mt-2 line-clamp-2">{course.description}</p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t flex items-center justify-between">
                <span className="text-sm text-gray-600 font-medium">
                  👥 {course.enrollmentCount || 0} Enrolled
                </span>
                <button
                  onClick={() => viewRoster(course)}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-xs font-medium"
                >
                  View Roster
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Student Roster Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">{selectedCourse.courseName} — Student Roster</h2>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{selectedCourse.courseCode}</p>
              </div>
              <button onClick={() => setSelectedCourse(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-6">
              {rosterLoading ? (
                <div className="text-center py-8 text-gray-500">Loading enrolled students...</div>
              ) : roster.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No students enrolled in this course yet.</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Student ID', 'Student Name', 'Enrollment Date', 'Status'].map(h => (
                        <th key={h} className="table-th">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {roster.map(r => (
                      <tr key={r.id}>
                        <td className="table-td font-mono text-xs">{r.studentStudentId}</td>
                        <td className="table-td font-medium">{r.studentName}</td>
                        <td className="table-td text-gray-500">{r.enrollmentDate || '—'}</td>
                        <td className="table-td">
                          <span className="badge-green">{r.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
