import * as CommentApi from "../../api/CommentRequests";

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
        return { success: false };
    }
};
export const deleteComment = (id) => async (dispatch) => {
    try {
        const { data } = await CommentApi.deleteComment(id);
        if (data.error) {
            return { success: false, error: data.error };
        }
        dispatch({ type: "COMMENT_DELETED", commentId: id });
        return { success: true };
    } catch (error) {
        console.log(error);
        return { success: false };
    }
};
