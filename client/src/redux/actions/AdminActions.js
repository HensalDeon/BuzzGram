import * as AdminApi from "../../api/AdminRequests";
import { logout } from "./AuthActions";

export const getUserDetails = () => async (dispatch) => {
    dispatch({ type: "FETCH_USERS_START" });
    try {
        const { data } = await AdminApi.getUserDetails();
        dispatch({ type: "FETCH_USERS_SUCCESS", data: data });
    } catch (error) {
        if (error.response.data.error === "Token has expired") {
            dispatch(logout());
        }
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
        if (error.response.data.error === "Token has expired") {
            dispatch(logout());
        }
    }
};
