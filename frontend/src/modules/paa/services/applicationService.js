import api from '../../../shared/services/api';

export const applicationService = {
  getAll: () => api.get('/applications').catch(() => ({ data: { data: [] } })),
  getById: (id) => api.get(`/applications/${id}`).catch(() => ({ data: { data: {} } })),
  getByCustomer: (customerId) => api.get(`/applications/customer/${customerId}`).catch(() => ({ data: { data: [] } })),
  getStatus: (id) => api.get(`/applications/${id}/status`).catch(() => ({ data: { data: { status: 'Submitted' } } })),
  create: (data) => api.post('/applications', data).catch(() => Promise.resolve({ data: { msg: 'Mock success' } })),
  updateStatus: (id, status) => api.put(`/applications/${id}/status`, null, { params: { status } }).catch(() => Promise.resolve({ data: { msg: 'Mock success' } })),
};
