import apiClient from "./client";

export const ordersApi = {
  getAll: (params) => apiClient.get('/admin/orders', { params }),
  getById: (id) => apiClient.get(`/admin/orders/${id}`),
  getTracking: (id) => apiClient.get(`/admin/orders/${id}/tracking`),
  updateStatus: (id, status) => apiClient.put(`/admin/orders/${id}/status`, { status }),
  refund: (id, data) => apiClient.post(`/admin/orders/${id}/refund`, data),
};