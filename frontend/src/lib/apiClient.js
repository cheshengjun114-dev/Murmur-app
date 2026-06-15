import axios from 'axios';
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  saveAuthTokens,
} from '../features/auth/authStorage.js';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api',
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const refreshToken = getRefreshToken();

    if (status !== 401 || originalRequest?._retry || !refreshToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const response = await axios.post(`${apiClient.defaults.baseURL}/auth/refresh`, {
        refreshToken,
      });
      const tokenData = response.data.data;

      saveAuthTokens(tokenData);
      originalRequest.headers.Authorization = `Bearer ${tokenData.accessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      clearAuthTokens();
      window.location.href = '/login';
      return Promise.reject(refreshError);
    }
  },
);
