import { userAxiosInstance } from "../utils/axiosInstance";

const API = userAxiosInstance();

export const getTimelinePosts = (id) => API.get(`/posts/${id}/timeline`);
export const getAllPosts = (id) => API.get(`/posts/${id}/all`);
export const likePost = (id, userId) => API.put(`posts/${id}/like`, { user: userId });
export const deletePost = (id, userId) => API.delete(`posts/${id}?user=${userId}`);
export const updatePost = (id, userId, data) => API.put(`posts/${id}?user=${userId}`, data);
export const savePost = (id, postId, isSaved) => API.patch(`posts/${id}/${postId}/${isSaved}`);
export const getSavedPosts = (id) => API.get(`posts/${id}/saved`);
export const getUserPosts = (id) => API.get(`posts/${id}`);
