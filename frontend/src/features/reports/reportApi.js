import { apiClient } from '../../lib/apiClient.js';

export async function reportPost({ postId, reason }) {
  const response = await apiClient.post(`/posts/${postId}/report`, { reason });
  return response.data.data;
}
