import api from './api';

export const registrationService = {
  getPendingRegistrations: () => api.get('/admin/registrations/pending'),
  getAllRegistrations: (status, role) => {
    const params = {};
    if (status && status !== 'ALL') params.status = status;
    if (role && role !== 'ALL') params.role = role;
    return api.get('/admin/registrations', { params });
  },
  getRegistrationById: (id) => api.get(`/admin/registrations/${id}`),
  approveRegistration: (id) => api.put(`/admin/registrations/${id}/approve`),
  rejectRegistration: (id, rejectionReason) =>
    api.put(`/admin/registrations/${id}/reject`, { rejectionReason }),
};