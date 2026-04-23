import apiClient from "./client";

export const bannersApi = {
  getAll: (params) => apiClient.get('/admin/banners', { params }),
  getById: (id) => apiClient.get(`/admin/banners/${id}`),
  create: (data) => apiClient.post('/admin/banners', data),
  update: (id, data) => apiClient.put(`/admin/banners/${id}`, data),
  delete: (id) => apiClient.delete(`/admin/banners/${id}`),
};