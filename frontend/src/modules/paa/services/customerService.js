import api from '../../../shared/services/api';

const mockCustomers = [
  {
    customerId: 101,
    name: "Harsha Vardhan",
    dob: "1992-08-15",
    income: 1200000,
    employmentType: "Salaried",
    status: "Active",
    contactInfo: { email: "harsha@example.com", phone: "9876543210", address: "123 Banking Street, Hyderabad" }
  },
  {
    customerId: 102,
    name: "Anjali Sharma",
    dob: "1995-12-10",
    income: 850000,
    employmentType: "SelfEmployed",
    status: "Active",
    contactInfo: { email: "anjali@example.com", phone: "9123456789", address: "45 Finance Row, Bangalore" }
  }
];

export const customerService = {
  getAll: () => api.get('/customers').catch(() => ({ data: { data: mockCustomers } })),
  getById: (id) => api.get(`/customers/${id}`).catch(() => ({ data: { data: mockCustomers.find(c => c.customerId == id) } })),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
  getMyProfile: () => api.get('/customers/my'),
};
