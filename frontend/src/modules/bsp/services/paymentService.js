import api from '../../../shared/services/api';

export const paymentService = {
  capture: (data) => api.post('/billing/payments/capture', data),
  getById: (id)   => api.get(`/billing/payments/${id}`),
  listAll: ()     => api.get('/billing/payments'),
};

export const statementService = {
  generate: (data) => api.post('/billing/statements/generate', data),
  close: (id)      => api.post(`/billing/statements/close/${id}`),
  getById: (id)    => api.get(`/billing/statements/${id}`),
  listAll: ()      => api.get('/billing/statements'),
};
