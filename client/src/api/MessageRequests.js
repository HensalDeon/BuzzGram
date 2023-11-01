import { userAxiosInstance } from "../utils/axiosInstance";

const API = userAxiosInstance();

export const getMessages = (id) => API.get(`/message/${id}`);

export const addMessage = (data) => API.post("/message/", data);
