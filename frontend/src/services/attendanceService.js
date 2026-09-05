import api from './api';
export const attendanceService = {
  get: (params = {}) => api.get('/attendance', { params }),
  markBulk: (data) => api.post('/attendance/bulk', data),
  update: (id, data) => api.put(`/attendance/${id}`, data),
  getSummary: (studentId) => api.get('/attendance/summary', { params: { studentId } }),
};
