import apiClient from "./client";

export const inventoryApi = {
  getAll: (params) => apiClient.get('/admin/inventory', { params }),
  update: (productId, data) => apiClient.put(`/admin/inventory/${productId}`, data),
};