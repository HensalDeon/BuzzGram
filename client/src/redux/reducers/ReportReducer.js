const initialState = { reports: [], loading: false, error: null };

const reportReducer = (state = initialState, action) => {
    switch (action.type) {
        case "CREATE_REPORT_SUCCESS":
            return { ...state, reports: [...state.reports, action.payload] };
        case "GET_REPORTS_SUCCESS":
            return { ...state, reports: action.payload };
        case "GET_REPORT_SUCCESS":
            // Implement logic to update a specific report by reportId
            return state;
        case "UPDATE_REPORT_SUCCESS":
            // Implement logic to update a specific report by reportId
            return state;
        case "DELETE_REPORT_SUCCESS":
            return {
                ...state,
                reports: state.reports.filter((report) => report._id !== action.payload),
            };
        default:
            return state;
    }
};

export default reportReducer;
