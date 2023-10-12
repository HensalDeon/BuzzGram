import { userAxiosInstance } from "../utils/axiosInstance";

const API = userAxiosInstance()
export const uploadImage = (formdata) =>
    API.post("/upload/", formdata, { headers: { "Content-Type": "multipart/form-data" } });
    
export const uploadPost = (data) => API.post("/posts", data);
