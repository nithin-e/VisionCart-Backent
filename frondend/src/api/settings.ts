import apiClient from "./client";

export const settingsApi = {
  get: () => apiClient.get('/admin/settings'),
  update: (data) => apiClient.put('/admin/settings', data),
};