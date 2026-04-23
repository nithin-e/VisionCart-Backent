import apiClient from "./client";

export const reviewsApi = {
  getAll: (params) => apiClient.get('/admin/reviews', { params }),
  getById: (id) => apiClient.get(`/admin/reviews/${id}`),
  hide: (id) => apiClient.delete(`/admin/reviews/${id}`),
  show: (id) => apiClient.patch(`/admin/reviews/${id}`, { isApproved: true }),
};