import { apiClient } from '../../lib/apiClient.js';

export async function getReportedPosts({ blindedOnly = false, page = 0, size = 10 } = {}) {
  const response = await apiClient.get('/admin/reports/posts', {
    params: { blindedOnly, page, size },
  });
  return response.data.data;
}

export async function getReportDetails(postId) {
  const response = await apiClient.get(`/admin/reports/posts/${postId}`);
  return response.data.data;
}

export async function blindReportedPost(postId) {
  const response = await apiClient.patch(`/admin/reports/posts/${postId}/blind`);
  return response.data.data;
}

export async function unblindReportedPost(postId) {
  const response = await apiClient.patch(`/admin/reports/posts/${postId}/unblind`);
  return response.data.data;
}

export async function deleteReportedPost(postId) {
  const response = await apiClient.delete(`/admin/reports/posts/${postId}`);
  return response.data.data;
}
