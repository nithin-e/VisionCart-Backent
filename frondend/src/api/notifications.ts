import apiClient from "./client";

export const notificationsApi = {
  getAll: (params) => apiClient.get('/admin/notifications', { params }),
  create: (data) => apiClient.post('/admin/notifications', data),
};