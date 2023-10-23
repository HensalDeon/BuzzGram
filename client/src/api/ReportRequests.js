import { userAxiosInstance, adminAxiosInstance } from "../utils/axiosInstance";

const API = userAxiosInstance();
const api = adminAxiosInstance();

export const createReport = (reporterId, targetType, targetId, reason) =>
    API.post("/report", { reporterId, targetType, targetId, reason });
export const getReports = (page) => api.get(`/report?page=${page}`);
export const getTargetData = (id, targetType) => api.get(`/report/target/${id}/${targetType}`);
export const updateReport = (id, reportId) => api.put(`/report/${id}/${reportId}`);
export const deleteReport = (id) => api.delete(`/report/${id}`);
