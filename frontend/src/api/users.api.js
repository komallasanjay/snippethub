import axiosInstance from './axiosInstance';

export const usersApi = {
  getProfile: async (username) => {
    const response = await axiosInstance.get(`/users/${username}`);
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await axiosInstance.put('/users/me', data);
    return response.data;
  },
  changePassword: async (data) => {
    const response = await axiosInstance.put('/users/me/password', data);
    return response.data;
  },
  deleteAccount: async () => {
    const response = await axiosInstance.delete('/users/me');
    return response.data;
  }
};
