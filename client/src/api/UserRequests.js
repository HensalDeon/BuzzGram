import { userAxiosInstance } from "../utils/axiosInstance";

const API = userAxiosInstance();

export const getUser = (userId) => API.get(`/user/${userId}`);
export const randomUsers = () => API.get(`/user/`);
export const updateUser = (id, formData) => API.put(`/user/${id}`, formData);
export const updateProfilePic = (id, profileUrl) => API.put(`/user/${id}/profile`, { profileimage: profileUrl });
export const updateCoverPic = (id, coverUrl) => API.put(`/user/${id}/cover`, { coverimage: coverUrl });
export const getAllUser = () => API.get("/user");
export const followUser = (id, curUserId) => API.put(`/user/${id}/follow`, { curUserId: curUserId });
export const unfollowUser = (id, curUserId) => API.put(`/user/${id}/unfollow`, { curUserId: curUserId });
export const searchUser = (value) => API.get(`/user/search?q=${value}`);
export const getFollowers = (id) => API.get(`/user/${id}/followers`);
export const getFollowing = (id) => API.get(`/user/${id}/following`);
