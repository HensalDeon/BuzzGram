import * as CommentApi from "../../api/CommentRequests";
import { logout } from "./AuthActions";

export const createComment = (formData) => async (dispatch) => {
    try {
        const { data } = await CommentApi.createComment(formData);
        if (data.error) {
            return { success: false, error: data.error };
        }
        dispatch({ type: "COMMENT_SUCCESS", postId: formData.postId, Id: data._id });
        return { success: true };
    } catch (error) {
        console.log(error);
        if (error.response.data.error === "Token has expired") {
            dispatch(logout());
        }
        return { success: false };
    }
};

export const deleteCmt = (id, postId) => (dispatch) => {
    dispatch({ type: "DELETE_COMMENT", id: id, postId: postId });
};
