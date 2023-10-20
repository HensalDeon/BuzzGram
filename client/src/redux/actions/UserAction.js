import * as UserApi from "../../api/UserRequests";
import { logout } from "./AuthActions";

export const updateUser = (id, formData) => async (dispatch) => {
    dispatch({ type: "UPDATING_START" });
    try {
        const { data } = await UserApi.updateUser(id, formData);
        dispatch({ type: "UPDATING_SUCCESS", data: data });
        return { success: true, message: data.message };
    } catch (error) {
        if (error.response.data.error === "Token has expired") {
            dispatch(logout());
        }
        dispatch({ type: "UPDATING_FAIL" });
        return { success: false, error: error.response.data.error };
    }
};

export const uploadProfilePic = (id, profileUrl) => async (dispatch) => {
    try {
        const { data } = await UserApi.updateProfilePic(id, profileUrl);
        dispatch({ type: "PROFILE_UPLOAD_SUCCESS", data: profileUrl, id: id });
        return { success: true, data };
    } catch (error) {
        if (error.response.data.error === "Token has expired") {
            dispatch(logout());
        }
        return { success: false };
    }
};

export const uploadCoverPic = (id, coverUrl) => async (dispatch) => {
    try {
        const { data } = await UserApi.updateCoverPic(id, coverUrl);
        dispatch({ type: "COVER_UPLOAD_SUCCESS", data: coverUrl, id: id });
        return { success: true, data };
    } catch (error) {
        if (error.response.data.error === "Token has expired") {
            dispatch(logout());
        }
        return { success: false };
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
