import * as ReportApi from "../../api/ReportRequests";

// Action Creators
export const createReport = (reporterId, targetType, targetId, reason) => async (dispatch) => {
    try {
        const response = await ReportApi.createReport(reporterId, targetType, targetId, reason);
        dispatch({ type: "CREATE_REPORT_SUCCESS", payload: response.data });
    } catch (error) {
        console.error("Error creating report:", error);
    }
};

export const getReports = () => async (dispatch) => {
    try {
        const response = await ReportApi.getReports();
        dispatch({ type: "GET_REPORTS_SUCCESS", payload: response.data });
    } catch (error) {
        console.error("Error getting reports:", error);
    }
};

export const getReport = (reportId) => async (dispatch) => {
    try {
        const response = await ReportApi.getReport(reportId);
        dispatch({ type: "GET_REPORT_SUCCESS", payload: response.data });
    } catch (error) {
        console.error("Error getting report:", error);
    }
};

export const updateReport = (reportId, updatedData) => async (dispatch) => {
    try {
        const response = await ReportApi.updateReport(reportId, updatedData);
        dispatch({ type: "UPDATE_REPORT_SUCCESS", payload: response.data });
    } catch (error) {
        console.error("Error updating report:", error);
    }
};

export const deleteReport = (reportId) => async (dispatch) => {
    try {
        const response = await ReportApi.deleteReport(reportId);
        dispatch({ type: "DELETE_REPORT_SUCCESS", payload: reportId });
    } catch (error) {
        console.error("Error deleting report:", error);
    }
};
