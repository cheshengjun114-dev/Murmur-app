import { apiClient } from '../../lib/apiClient.js';

export async function getReactionSummary(postId) {
  const response = await apiClient.get(`/posts/${postId}/reactions`);
  return response.data.data;
}

export async function toggleReaction({ postId, reactionType }) {
  const response = await apiClient.post(`/posts/${postId}/reactions`, {
    reactionType,
  });
  return response.data.data;
}
