import apiClient from "./client";

export const reportsApi = {
  getSales: (params) => apiClient.get('/admin/reports/sales', { params }),
  getUsers: (params) => apiClient.get('/admin/reports/users', { params }),
};