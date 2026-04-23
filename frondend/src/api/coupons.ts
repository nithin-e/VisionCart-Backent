import apiClient from "./client";

export const couponsApi = {
  getAll: (params) => apiClient.get('/admin/coupons', { params }),
  getById: (id) => apiClient.get(`/admin/coupons/${id}`),
  create: (data) => apiClient.post('/admin/coupons', data),
  update: (id, data) => apiClient.put(`/admin/coupons/${id}`, data),
  delete: (id) => apiClient.delete(`/admin/coupons/${id}`),
};