import axiosInstance from './axiosInstance';

export const snippetsApi = {
  getAll: async (params) => {
    const response = await axiosInstance.get('/snippets', { params });
    return response.data;
  },
  getMySnippets: async (params) => {
    const response = await axiosInstance.get('/snippets/my', { params });
    return response.data;
  },
  getStarred: async (params) => {
    const response = await axiosInstance.get('/snippets/starred', { params });
    return response.data;
  },
  getLanguages: async () => {
    const response = await axiosInstance.get('/snippets/languages');
    return response.data;
  },
  getById: async (id) => {
    const response = await axiosInstance.get(`/snippets/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await axiosInstance.post('/snippets', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await axiosInstance.put(`/snippets/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await axiosInstance.delete(`/snippets/${id}`);
    return response.data;
  },
  copy: async (id) => {
    const response = await axiosInstance.post(`/snippets/${id}/copy`);
    return response.data;
  },
  toggleStar: async (id) => {
    const response = await axiosInstance.post(`/snippets/${id}/star`);
    return response.data;
  },
  getShareLinks: async (id) => {
    const response = await axiosInstance.get(`/share/snippets/${id}/links`);
    return response.data;
  },
  generateShareLink: async (id, data) => {
    const response = await axiosInstance.post(`/share/snippets/${id}/links`, data);
    return response.data;
  },
  revokeShareLink: async (token) => {
    const response = await axiosInstance.delete(`/share/links/${token}`);
    return response.data;
  }
};
