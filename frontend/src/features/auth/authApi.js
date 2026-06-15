import { apiClient } from '../../lib/apiClient.js';

export async function signup(request) {
  const response = await apiClient.post('/auth/signup', request);
  return response.data;
}

export async function login(request) {
  const response = await apiClient.post('/auth/login', request);
  return response.data.data;
}

export async function logout(refreshToken) {
  const response = await apiClient.post('/auth/logout', { refreshToken });
  return response.data;
}
