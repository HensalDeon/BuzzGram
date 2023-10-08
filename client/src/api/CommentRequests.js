import axios from "axios";
import env from "../../env";

const API = axios.create({ baseURL: env.REACT_APP_SERVER_DOMAIN });

API.interceptors.request.use((req) => {
    if (localStorage.getItem("profile")) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile")).token}`;
    }

    return req;
});

export const createComment = (formData) => API.post(`/posts/comment`, formData);
export const likeComment = (commentId, user) => API.post(`/posts/like-comment`, { commentId, user });
export const updateComment = (id, text) => API.put(`/posts/${id}/update-comment`, {text});
export const getComments = (postId) => API.get(`/posts/${postId}/comments`);
