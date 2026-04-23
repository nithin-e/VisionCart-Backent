import apiClient from "./client";

export const productsApi = {
  getAll: (params) => apiClient.get('/admin/products', { params }),
  getById: (id) => apiClient.get(`/admin/products/${id}`),
  create: (data) => apiClient.post('/admin/products', data),
  update: (id, data) => apiClient.put(`/admin/products/${id}`, data),
  delete: (id) => apiClient.delete(`/admin/products/${id}`),
};