import { createAxiosInstance } from "../utils/axiosInstance";

const API = createAxiosInstance()

// API function to fetch user details
export const getUserDetails = () => API.get(`/admin/userlist`);
export const blockUnblockUser = (userId) => API.put(`/admin/action`, { user: userId });

// export default API;
