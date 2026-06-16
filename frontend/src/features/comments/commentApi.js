import { apiClient } from '../../lib/apiClient.js';

export async function getComments(postId) {
  const response = await apiClient.get(`/posts/${postId}/comments`);
  return response.data.data;
}

export async function createComment({ postId, content, parentCommentId }) {
  const response = await apiClient.post(`/posts/${postId}/comments`, {
    content,
    parentCommentId,
  });
  return response.data.data;
}

export async function updateComment({ commentId, content }) {
  const response = await apiClient.patch(`/comments/${commentId}`, { content });
  return response.data;
}

export async function deleteComment(commentId) {
  const response = await apiClient.delete(`/comments/${commentId}`);
  return response.data;
}
