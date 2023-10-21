import { userAxiosInstance } from "../utils/axiosInstance";

const API = userAxiosInstance();

export const createReport = (reporterId, targetType, targetId, reason) =>
    API.post("/report", { reporterId, targetType, targetId, reason });
export const getReports = () => API.get("/report");
export const getTargetData = (id, targetType) => API.get(`/report/target/${id}/${targetType}`);
