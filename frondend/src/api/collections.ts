import apiClient from "./client";

export const collectionsApi = {
  getAll: (params) => apiClient.get('/admin/collections', { params }),
  getById: (id) => apiClient.get(`/admin/collections/${id}`),
  create: (data) => apiClient.post('/admin/collections', data),
  update: (id, data) => apiClient.put(`/admin/collections/${id}`, data),
  delete: (id) => apiClient.delete(`/admin/collections/${id}`),
  addProducts: (id, productIds) => apiClient.post(`/admin/collections/${id}/products`, { productIds }),
};