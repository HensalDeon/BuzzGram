import axios from "axios";
import env from "../../env";

const API = axios.create({ baseURL: env.REACT_APP_SERVER_DOMAIN });

export const getMessages = (id) => API.get(`/message/${id}`);

export const addMessage = (data) => API.post("/message/", data);
