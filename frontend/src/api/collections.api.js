import axiosInstance from './axiosInstance';

export const collectionsApi = {
  getMyCollections: async (params) => {
    const response = await axiosInstance.get('/collections/my', { params });
    return response.data;
  },
  getPublicCollections: async (params) => {
    const response = await axiosInstance.get('/collections/public', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await axiosInstance.get(`/collections/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await axiosInstance.post('/collections', data);
    return response.data;
  },
  delete: async (id) => {
    const response = await axiosInstance.delete(`/collections/${id}`);
    return response.data;
  },
  addSnippet: async (collectionId, snippetId) => {
    const response = await axiosInstance.post(`/collections/${collectionId}/snippets/${snippetId}`);
    return response.data;
  },
  removeSnippet: async (collectionId, snippetId) => {
    const response = await axiosInstance.delete(`/collections/${collectionId}/snippets/${snippetId}`);
    return response.data;
  }
};
