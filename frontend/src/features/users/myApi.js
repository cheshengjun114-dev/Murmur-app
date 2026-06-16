import { apiClient } from '../../lib/apiClient.js';

export async function getMyProfile() {
  const response = await apiClient.get('/me');
  return response.data.data;
}

export async function getMyPosts({ page = 0, size = 10 } = {}) {
  const response = await apiClient.get('/me/posts', {
    params: { page, size },
  });
  return response.data.data;
}
