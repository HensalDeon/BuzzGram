import axios from "axios";
import env from "../../env";

const API = axios.create({ baseURL: env.REACT_APP_SERVER_DOMAIN });

export const createChat = (data) => API.post("/chat/", data);

export const userChats = (id) => API.get(`/chat/${id}`);

export const findChat = (firstId, secondId) => API.get(`/chat/find/${firstId}/${secondId}`);
