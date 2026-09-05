import api from './api';

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  registerStudent: (data) => api.post('/auth/register/student', data),
  registerFaculty: (data) => api.post('/auth/register/faculty', data),
  getMe: () => api.get('/auth/me'),
  checkHealth: () => api.get('/health'),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  getToken: () => localStorage.getItem('token'),
  isAuthenticated: () => !!localStorage.getItem('token'),
  getRole: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).role : null;
  },
};