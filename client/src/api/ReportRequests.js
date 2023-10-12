import { userAxiosInstance } from "../utils/axiosInstance";

const API = userAxiosInstance();

export const createReport = (reporterId, targetType, targetId, reason) =>
    API.post("/report", { reporterId, targetType, targetId, reason });
