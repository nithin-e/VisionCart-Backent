import apiClient from "./client";

export const paymentsApi = {
  getAll: (params) => apiClient.get('/admin/payments', { params }),
  getById: (id) => apiClient.get(`/admin/payments/${id}`),
};