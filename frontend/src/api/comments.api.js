import axiosInstance from './axiosInstance';

export const commentsApi = {
  getBySnippet: async (snippetId, params) => {
    const response = await axiosInstance.get(`/snippets/${snippetId}/comments`, { params });
    return response.data;
  },
  add: async (snippetId, data) => {
    const response = await axiosInstance.post(`/snippets/${snippetId}/comments`, data);
    return response.data;
  },
  update: async (snippetId, commentId, data) => {
    const response = await axiosInstance.put(`/snippets/${snippetId}/comments/${commentId}`, data);
    return response.data;
  },
  delete: async (snippetId, commentId) => {
    const response = await axiosInstance.delete(`/snippets/${snippetId}/comments/${commentId}`);
    return response.data;
  }
};
