import * as AdminApi from "../../api/AdminRequests";

export const getUserDetails = () => async (dispatch) => {
    dispatch({ type: "FETCH_USERS_START" });
    try {
        const { data } = await AdminApi.getUserDetails();
        dispatch({ type: "FETCH_USERS_SUCCESS", data: data });
    } catch (error) {
        console.error(error);
        dispatch({ type: "FETCH_USERS_FAIL", error: error });
    }
};

export const blockUnblockUser = (userId) => async (dispatch) => {
    try {
        const response = await AdminApi.blockUnblockUser(userId);
        if (response.status === 200) {
            const actionType = response.data.includes("User blocked") ? "BLOCK_USER" : "UNBLOCK_USER";
            dispatch({ type: actionType, userId });
        }
    } catch (error) {
        console.log(error);
    }
};
