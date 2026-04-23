import apiClient from "./client";

export const tryAtHomeApi = {
  getAll: (params) => apiClient.get('/admin/try-at-home', { params }),
  getById: (id) => apiClient.get(`/admin/try-at-home/${id}`),
  updateStatus: (id, status) => apiClient.put(`/admin/try-at-home/${id}/status`, { status }),
};