import axios from "axios";
import env from "../../env";

const API = axios.create({ baseURL: env.REACT_APP_SERVER_DOMAIN });

API.interceptors.request.use((req) => {
    if (localStorage.getItem("admin")) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("admin")).token}`;
    }

    return req;
});

// API function to fetch user details
export const getUserDetails = () => API.get(`/admin/userlist`);
export const blockUnblockUser = (userId) => API.put(`/admin/action`, { user: userId });

export default API;
