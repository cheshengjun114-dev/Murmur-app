import { apiClient } from '../../lib/apiClient.js';

export async function toggleBookmark(postId) {
  const response = await apiClient.post(`/posts/${postId}/bookmark`);
  return response.data.data;
}

export async function getMyBookmarks({ page = 0, size = 10 } = {}) {
  const response = await apiClient.get('/me/bookmarks', {
    params: { page, size },
  });
  return response.data.data;
}
