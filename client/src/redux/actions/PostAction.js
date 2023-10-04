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
