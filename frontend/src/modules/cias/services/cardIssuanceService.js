import api from '../../../shared/services/api';

export const cardIssuanceService = {
  issueCard: (data) => api.post('/api/cards', data),
  getCard: (id) => api.get(`/api/cards/${id}`),
  blockCard: (id) => api.post(`/api/cards/block/${id}`),
  getMyCards: () => api.get('/api/cards/my'),
};

export const accountSetupService = {
  createAccount: (data) => api.post('/accounts', data),
  getAccount: (id) => api.get(`/accounts/${id}`),
  getMyAccount: () => api.get('/accounts/my'),
  getAllAccounts: () => api.get('/api/accounts'),
};
