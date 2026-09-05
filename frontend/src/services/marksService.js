import api from './api';
export const marksService = {
  getAll: (params = {}) => api.get('/marks', { params }),
  getByStudent: (studentId) => api.get(`/marks/student/${studentId}`),
  create: (data) => api.post('/marks', data),
  update: (id, data) => api.put(`/marks/${id}`, data),
};
