import { userAxiosInstance, adminAxiosInstance } from "../utils/axiosInstance";

const API = userAxiosInstance();
const api = adminAxiosInstance();

export const likeComment = (commentId, user) => API.post(`/posts/like-comment`, { commentId, user });
export const createComment = (formData) => API.post(`/posts/comment`, formData);
export const updateComment = (id, text) => API.put(`/posts/${id}/update-comment`, { text });
export const getComments = (postId) => API.get(`/posts/${postId}/comments`);
export const deleteComment = (id) => API.delete(`/posts/${id}/comment`);
export const adminDeleteComment = (id) => api.delete(`/posts/${id}/comment`);
