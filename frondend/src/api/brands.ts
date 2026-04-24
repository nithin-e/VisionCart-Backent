import apiClient from "./client";

export const brandsApi = {
  getAll: (params) => apiClient.get('/admin/brands', { params }),
  getById: (id) => apiClient.get(`/admin/brands/${id}`),
  create: (data) => apiClient.post('/admin/brands', data),
  update: (id, data) => apiClient.put(`/admin/brands/${id}`, data),
  delete: (id) => apiClient.delete(`/admin/brands/${id}`),
};