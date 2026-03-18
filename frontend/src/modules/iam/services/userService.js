import api from '../../../shared/services/api';

export const userService = {
  login: (email, password) =>
    api.post('/users/login', { email, password }),

  register: (userData) =>
    api.post('/users/register', userData),

  logout: () =>
    api.post('/users/logout'),

  getAllUsers: () =>
    api.get('/users'),

  getUserById: (id) =>
    api.get(`/users/${id}`),
};
