import { adminAxiosInstance } from "../utils/axiosInstance";

const API = adminAxiosInstance();

export const getUserDetails = () => API.get(`/admin/userlist`);
export const blockUnblockUser = (userId) => API.put(`/admin/action`, { user: userId });
export const deletePost = (id, userId) => API.delete(`posts/${id}?user=${userId}`);
export const getDashboardData = () => API.get("/admin/dashboard");
