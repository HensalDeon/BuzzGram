import { userAxiosInstance } from "../utils/axiosInstance";

const API = userAxiosInstance();

export const createNotification = (data) => API.post(`/notification/`, data);

export const getNotifications = (userId) => API.get(`/notification/${userId}`);
