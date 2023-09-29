import * as UploadApi from "../../api/UploadRequest";

export const uploadImage = (formdata) => async () => {
    try {
        console.log("Image upload Action start ho gya hy",formdata);
        let res = await UploadApi.uploadImage(formdata);
        return { url: res.data.url };
    } catch (error) {
        console.log(error);
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
