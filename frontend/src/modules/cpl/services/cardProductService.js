import api from '../../../shared/services/api';

const mockProducts = [
  { productId: 1, name: "Visa Platinum", category: "PLATINUM", interestRate: 14.5, annualFee: 2500, status: "Active" },
  { productId: 2, name: "Mastercard Gold", category: "GOLD", interestRate: 16.0, annualFee: 1500, status: "Active" },
  { productId: 3, name: "Student Lite", category: "STUDENT", interestRate: 18.0, annualFee: 0, status: "Active" }
];

export const cardProductService = {
  getAll: () => api.get('/api/products').catch(() => ({ data: { data: mockProducts } })),
  getById: (id) => api.get(`/api/products/${id}`).catch(() => ({ data: { data: mockProducts.find(p => p.productId == id) } })),
  create: (data) => api.post('/api/products', data),
};

export const feeConfigService = {
  getAll: () => api.get('/api/fees'),
  getById: (id) => api.get(`/api/fees/${id}`),
  create: (data) => api.post('/api/fees', data),
};
