import apiClient from "./client";

export const categoriesApi = {
  getAll: (params) => apiClient.get('/admin/categories', { params }),
  getById: (id) => apiClient.get(`/admin/categories/${id}`),
  create: (data) => apiClient.post('/admin/categories', data),
  update: (id, data) => apiClient.put(`/admin/categories/${id}`, data),
  delete: (id) => apiClient.delete(`/admin/categories/${id}`),
};