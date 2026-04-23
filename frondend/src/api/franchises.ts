import apiClient from "./client";

export const franchisesApi = {
  getAll: (params) => apiClient.get('/admin/franchise', { params }),
  updateStatus: (id, status) => apiClient.put(`/admin/franchise/${id}/status`, { status }),
};