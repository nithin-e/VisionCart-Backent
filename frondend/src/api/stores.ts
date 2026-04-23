import apiClient from "./client";

export const storesApi = {
  getAll: (params) => apiClient.get('/admin/stores', { params }),
  getById: (id) => apiClient.get(`/admin/stores/${id}`),
  create: (data) => apiClient.post('/admin/stores', data),
  update: (id, data) => apiClient.put(`/admin/stores/${id}`, data),
  delete: (id) => apiClient.delete(`/admin/stores/${id}`),
};