import * as UploadApi from "../../api/UploadRequest";
import { logout } from "./AuthActions";

export const uploadImage = (formdata) => async (dispatch) => {
    dispatch({type: "IMG_UPLOAD_START"});
    try {
        let res = await UploadApi.uploadImage(formdata);
        dispatch({ type: "IMG_UPLOAD_SUCCESS"});
        return { url: res.data.url };
    } catch (error) {
        console.log(error);
        if (error.response.data.error === "Token has expired") {
            dispatch(logout());
        }
        dispatch({ type: "IMG_UPLOAD_FAIL" });
    }
};

export const uploadPost = (data) => async (dispatch) => {
    dispatch({ type: "UPLOAD_START" });
    try {
        const newPost = await UploadApi.uploadPost(data);
        console.log(newPost,'upload');
        dispatch({ type: "UPLOAD_SUCCESS", data: newPost.data });
    } catch (error) {
        console.log(error);
        if (error.response.data.error === "Token has expired") {
            dispatch(logout());
        }
        dispatch({ type: "UPLOAD_FAIL" });
    }
};
