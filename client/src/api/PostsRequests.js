import axios from "axios";
import env from "../../env";

const API = axios.create({ baseURL: env.REACT_APP_SERVER_DOMAIN });

API.interceptors.request.use((req) => {
    if (localStorage.getItem("profile")) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile")).token}`;
    }

    return req;
});

export const getTimelinePosts = (id) => API.get(`/posts/${id}/timeline`);
export const likePost = (id, userId) => API.put(`posts/${id}/like`, { user: userId });
