import api from '../../../shared/services/api';

export const transactionService = {
  authorize: (data) => api.post('/transactions/authorize', data),
  post: (id)      => api.post(`/transactions/post/${id}`),
  reverse: (id)   => api.post(`/transactions/reverse/${id}`),
  getById: (id)   => api.get(`/transactions/${id}`),
  listAll: ()     => api.get('/transactions'),
  listMy: ()      => api.get('/transactions/my'),
};
