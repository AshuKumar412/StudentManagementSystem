import api from './api';
export const enrollmentService = {
  getAll: (params = {}) => api.get('/enrollments', { params }),
  create: (data) => api.post('/enrollments', data),
  update: (id, data) => api.put(`/enrollments/${id}`, data),
  delete: (id) => api.delete(`/enrollments/${id}`),
};
