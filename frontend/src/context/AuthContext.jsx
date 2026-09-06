import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (stored && token) {
        const parsed = JSON.parse(stored);
        if (parsed.role) {
          parsed.role = parsed.role.replace(/^ROLE_/, '').toUpperCase();
        }
        setUser(parsed);
      }
    } catch (e) {
      console.error('Error parsing stored user:', e);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const data = res.data?.data || res.data;
    const token = data.token || data.accessToken;
    let role = data.role || data.user?.role;
    if (role && typeof role === 'string') {
      role = role.replace(/^ROLE_/, '').toUpperCase();
    }
    const userInfo = data.user || {
      id: data.id || data.userId,
      name: data.name || data.fullName,
      email: data.email,
    };
    const userData = { ...userInfo, role, accountStatus: data.accountStatus || userInfo.accountStatus };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const registerAdmin = async (data) => {
    const res = await authService.registerAdmin(data);
    return res.data;
  };

  const registerStudent = async (data) => {
    const res = await authService.registerStudent(data);
    return res.data;
  };

  const registerFaculty = async (data) => {
    const res = await authService.registerFaculty(data);
    return res.data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        registerAdmin,
        registerStudent,
        registerFaculty,
        logout,
        loading,
        isAuthenticated: !!user && !!localStorage.getItem('token')
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};