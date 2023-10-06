import * as PostsApi from "../../api/PostsRequests";

export const getTimelinePosts = (id) => async (dispatch) => {
    dispatch({ type: "RETREIVING_START" });
    try {
        const { data } = await PostsApi.getTimelinePosts(id);
        dispatch({ type: "RETREIVING_SUCCESS", data: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "RETREIVING_FAIL" });
    }
};

export const likePost = (postId, userId) => async (dispatch) => {
    try {
        const response = await PostsApi.likePost(postId, userId);
        if (response.status === 200) {
            const actionType = response.data.includes("Post liked") ? "LIKE_POST" : "UNLIKE_POST";
            dispatch({ type: actionType, postId, userId });
        }
    } catch (error) {
        console.log(error);
    }
};

export const updatePost = (postId, userId, editedData) => async (dispatch) => {
    try {
        const response = await PostsApi.updatePost(postId, userId, editedData);
        if (response.status === 200) {
            dispatch({ type: "EDIT_POST_SUCCESS", postId, editedData });
            return { success: true };
        } else {
            return { success: false };
        }
    } catch (error) {
        console.log(error);
    }
};
export const deletePost = (postId, userId) => async (dispatch) => {
    try {
        const response = await PostsApi.deletePost(postId, userId);
        if (response.status === 200) {
            dispatch({ type: "DELETE_POST_SUCCESS", postId });
            return { success: true };
        } else {
            return { success: false };
        }
    } catch (error) {
        console.log(error);
    }
};
