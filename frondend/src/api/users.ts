import apiClient from "./client";

export const usersApi = {
  getAll: (params) => apiClient.get('/admin/users', { params }),
  getById: (id) => apiClient.get(`/admin/users/${id}`),
  block: (id) => apiClient.put(`/admin/users/${id}/block`),
  unblock: (id) => apiClient.put(`/admin/users/${id}/unblock`),
};