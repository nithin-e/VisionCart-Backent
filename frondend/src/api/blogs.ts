import apiClient from "./client";

export const blogsApi = {
  getAll: (params) => apiClient.get('/admin/blogs', { params }),
  getById: (id) => apiClient.get(`/admin/blogs/${id}`),
  create: (data) => apiClient.post('/admin/blogs', data),
  update: (id, data) => apiClient.put(`/admin/blogs/${id}`, data),
  delete: (id) => apiClient.delete(`/admin/blogs/${id}`),
};