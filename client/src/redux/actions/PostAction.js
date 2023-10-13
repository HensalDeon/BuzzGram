import * as PostsApi from "../../api/PostsRequests";
import { logout } from "./AuthActions";

export const getTimelinePosts = (id) => async (dispatch) => {
    dispatch({ type: "RETREIVING_START" });
    try {
        const { data } = await PostsApi.getTimelinePosts(id);
        dispatch({ type: "RETREIVING_SUCCESS", data: data });
    } catch (error) {
        console.log(error);
        if (error.response.data.error === "Token has expired") {
            dispatch(logout());
        }
        dispatch({ type: "RETREIVING_FAIL" });
    }
};
export const getAllPosts = (user) => async (dispatch) => {
    dispatch({ type: "GET_POSTS_START" });
    try {
        const { data } = await PostsApi.getAllPosts(user);
        dispatch({ type: "GET_POSTS_SUCCESS", data: data });
    } catch (error) {
        console.log(error);
        if (error.response.data.error === "Token has expired") {
            dispatch(logout());
        }
        dispatch({ type: "GET_POSTS_FAIL" });
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
        if (error.response.data.error === "Token has expired") {
            dispatch(logout());
        }
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
        if (error.response.data.error === "Token has expired") {
            dispatch(logout());
        }
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
        if (error.response.data.error === "Token has expired") {
            dispatch(logout());
        }
    }
};

export const savePost = (id, postId, isSaved) => async (dispatch) => {
    try {
        const response = await PostsApi.savePost(id, postId, isSaved);
        if (response.status === 200) {
            dispatch({ type: "UPDATE_SAVED", postId, isSaved });
            return { success: true, message: response.data.message };
        } else {
            return { success: false, error: response.data.error };
        }
    } catch (error) {
        console.log(error);
        if (error.response.data.error === "Token has expired") {
            dispatch(logout());
        }
        return { success: false, error: error.response.data.error };
    }
};
