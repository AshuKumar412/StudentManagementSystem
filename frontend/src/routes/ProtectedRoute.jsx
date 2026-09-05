import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, roles }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0) {
    const userRole = (user?.role || '').replace(/^ROLE_/, '').toUpperCase();
    const allowedRoles = roles.map(r => r.replace(/^ROLE_/, '').toUpperCase());

    if (!allowedRoles.includes(userRole)) {
      const roleRedirects = {
        ADMIN: '/admin/dashboard',
        TEACHER: '/teacher/dashboard',
        STUDENT: '/student/dashboard'
      };
      return <Navigate to={roleRedirects[userRole] || '/login'} replace />;
    }
  }

  return children;
}
