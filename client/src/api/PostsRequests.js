import { userAxiosInstance } from "../utils/axiosInstance";

const API = userAxiosInstance();

export const getTimelinePosts = (id, page) => API.get(`/posts/${id}/timeline?page=${page}`);
export const getAllPosts = (id, page) => API.get(`/posts/${id}/all?page=${page}`);
export const getSavedPosts = (id) => API.get(`posts/${id}/saved`);
export const getLikedUsersDetail = (id) => API.get(`posts/${id}/liked-users`);
export const getUserPosts = (id) => API.get(`posts/${id}`);
export const likePost = (id, userId) => API.put(`/posts/${id}/like`, { user: userId });
export const updatePost = (id, userId, data) => API.put(`posts/${id}?user=${userId}`, data);
export const savePost = (id, postId, isSaved) => API.patch(`posts/${id}/${postId}/${isSaved}`);
export const deletePost = (id, userId) => API.delete(`posts/${id}?user=${userId}`);
