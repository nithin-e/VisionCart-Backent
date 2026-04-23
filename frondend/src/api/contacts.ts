import apiClient from "./client";

export const contactsApi = {
  getAll: (params) => apiClient.get('/admin/contact', { params }),
  reply: (id, replyData) => apiClient.put(`/admin/contact/${id}/reply`, replyData),
};