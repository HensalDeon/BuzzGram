import { userAxiosInstance } from "../utils/axiosInstance";

const API = userAxiosInstance()

export const getTimelinePosts = (id) => API.get(`/posts/${id}/timeline`);
export const getAllPosts = () => API.get('/posts/all')
export const likePost = (id, userId) => API.put(`posts/${id}/like`, { user: userId });
export const deletePost = (id, userId) => API.delete(`posts/${id}?user=${userId}`);
export const updatePost = (id, userId, data) => API.put(`posts/${id}?user=${userId}`, data);
