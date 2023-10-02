import * as UploadApi from "../../api/UploadRequest";

export const uploadImage = (formdata) => async (dispatch) => {
    dispatch({type: "IMG_UPLOAD_START"});
    try {
        let res = await UploadApi.uploadImage(formdata);
        dispatch({ type: "IMG_UPLOAD_SUCCESS"});
        return { url: res.data.url };
    } catch (error) {
        console.log(error);
        dispatch({ type: "IMG_UPLOAD_FAIL" });
    }
};

export const uploadPost = (data) => async (dispatch) => {
    dispatch({ type: "UPLOAD_START" });
    try {
        const newPost = await UploadApi.uploadPost(data);
        dispatch({ type: "UPLOAD_SUCCESS", data: newPost.data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "UPLOAD_FAIL" });
    }
};
