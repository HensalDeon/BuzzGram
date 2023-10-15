import * as UserApi from "../../api/UserRequests";
import { logout } from "./AuthActions";

export const updateUser = (id, formData) => async (dispatch) => {
    dispatch({ type: "UPDATING_START" });
    try {
        const { data } = await UserApi.updateUser(id, formData);
        console.log("Action ko receive hoa hy ye : ", data);
        dispatch({ type: "UPDATING_SUCCESS", data: data });
    } catch (error) {
        if (error.response.data.error === "Token has expired") {
            dispatch(logout());
        }
        dispatch({ type: "UPDATING_FAIL" });
    }
};

export const followUser = (id, curUserId) => async (dispatch) => {
    try {
        const response = await UserApi.followUser(id, curUserId);
        if (response.status === 201) {
            dispatch({ type: "FOLLOW_USER", data: id });
            return { success: true, message: response.data.message };
        }
        return { success: false, error: response.data.error };
    } catch (error) {
        if (error.response.data.error === "Token has expired") {
            dispatch(logout());
        }
        console.log(error);
        return { success: false, error: error.response.data.error };
    }
};

export const unfollowUser = (id, data) => async (dispatch) => {
    try {
        const response = await UserApi.unfollowUser(id, data);
        if (response.status === 201) {
            dispatch({ type: "UNFOLLOW_USER", data: id });
            return { success: true, message: response.data.message };
        }
        return { success: false, error: response.data.error };
    } catch (error) {
        if (error.response.data.error === "Token has expired") {
            dispatch(logout());
        }
        console.log(error);
        return { success: false, error: error.response.data.error };
    }
};
