import api from '../../../shared/services/api';

export const cardIssuanceService = {
  issueCard: (data) => api.post('/api/cards', data),
  getCard: (id) => api.get(`/api/cards/${id}`),
  blockCard: (id) => api.post(`/api/cards/block/${id}`),
};

export const accountSetupService = {
  createAccount: (data) => api.post('/api/accounts', data),
  getAccount: (id) => api.get(`/api/accounts/${id}`),
  getAllAccounts: () => api.get('/api/accounts'),
};
