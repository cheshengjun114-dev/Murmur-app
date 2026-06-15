import { apiClient } from '../../lib/apiClient.js';

export async function getPosts({ categoryId, page = 0, size = 10 }) {
  const response = await apiClient.get('/posts', {
    params: {
      categoryId,
      page,
      size,
    },
  });

  return response.data.data;
}

export async function getPost(postId) {
  const response = await apiClient.get(`/posts/${postId}`);
  return response.data.data;
}

export async function createPost(request) {
  const response = await apiClient.post('/posts', request);
  return response.data.data;
}

export async function updatePost({ postId, request }) {
  const response = await apiClient.patch(`/posts/${postId}`, request);
  return response.data;
}

export async function deletePost(postId) {
  const response = await apiClient.delete(`/posts/${postId}`);
  return response.data;
}
