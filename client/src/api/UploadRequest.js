import axios from "axios";
import env from "../../env";

const API = axios.create({ baseURL: env.REACT_APP_SERVER_DOMAIN });

API.interceptors.request.use((req) => {
    if (localStorage.getItem("profile")) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("profile")).token}`;
    }

    return req;
});

export const uploadImage = (formdata) =>
    API.post("/upload/", formdata, { headers: { "Content-Type": "multipart/form-data" } });
    
export const uploadPost = (data) => API.post("/posts", data);
