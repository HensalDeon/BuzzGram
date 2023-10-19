const postReducer = (
    state = {
        posts: [],
        hasMorePosts: true,
        moreTimelinePosts: true,
        allPosts: [],
        loading: false,
        timeLineloading: false,
        error: false,
        imgError: false,
        uploading: false,
    },
    action
) => {
    switch (action.type) {
        case "IMG_UPLOAD_START":
            return { ...state, imgError: false, uploading: true };
        case "IMG_UPLOAD_SUCCESS":
            return { ...state, uploading: false, imgError: false };
        case "IMG_UPLOAD_FAIL":
            return { ...state, uploading: false, imgError: true };
        case "UPLOAD_START":
            return { ...state, error: false, uploading: true };
        case "UPLOAD_SUCCESS":
            return { ...state, posts: [action.data, ...state.posts], uploading: false, error: false, hasMorePosts: true };
        case "PROFILE_UPLOAD_SUCCESS":
            return {
                ...state,
                posts: state.posts.map((post) => {
                    if (post.user._id === action.id) {
                        return {
                            ...post,
                            user: {
                                ...post.user,
                                profileimage: action.data,
                            },
                        };
                    }
                    return post;
                }),
                allPosts: state.allPosts.map((post) => {
                    if (post.user._id === action.id) {
                        return {
                            ...post,
                            user: {
                                ...post.user,
                                profileimage: action.data,
                            },
                        };
                    }
                    return post;
                }),
            };
        case "UPLOAD_FAIL":
            return { ...state, uploading: false, error: true };
        case "RETREIVING_START":
            return { ...state, timeLineloading: true, error: false };
        case "RETREIVING_SUCCESS":
            return {
                ...state,
                posts: action.data.length > 0 ? [...state.posts, ...action.data] : state.posts,
                timeLineloading: false,
                error: false,
                moreTimelinePosts: action.data.length > 0,
            };
        case "RETREIVING_FAIL":
            return { ...state, timeLineloading: false, error: true };
        case "GET_POSTS_START":
            return { ...state, loading: true, error: false };
        case "GET_POSTS_SUCCESS":
            return {
                ...state,
                allPosts: action.data.length > 0 ? [...state.allPosts, ...action.data] : state.allPosts,
                loading: false,
                error: false,
                hasMorePosts: action.data.length > 0,
            };
        case "GET_POSTS_FAIL":
            return { ...state, loading: false, error: true };
        case "LIKE_POST":
            return {
                ...state,
                posts: state.posts.map((post) => {
                    if (post._id === action.postId) {
                        return {
                            ...post,
                            likes: [...post.likes, action.userId],
                        };
                    }
                    return post;
                }),
                allPosts: state.allPosts.map((post) => {
                    if (post._id === action.postId) {
                        return {
                            ...post,
                            likes: [...post.likes, action.userId],
                        };
                    }
                    return post;
                }),
            };
        case "UNLIKE_POST":
            return {
                ...state,
                posts: state.posts.map((post) => {
                    if (post._id === action.postId) {
                        return {
                            ...post,
                            likes: post.likes.filter((id) => id !== action.userId),
                        };
                    }
                    return post;
                }),
                allPosts: state.allPosts.map((post) => {
                    if (post._id === action.postId) {
                        return {
                            ...post,
                            likes: post.likes.filter((id) => id !== action.userId),
                        };
                    }
                    return post;
                }),
            };
        case "EDIT_POST_SUCCESS":
            return {
                ...state,
                posts: state.posts.map((post) => {
                    if (post._id === action.postId) {
                        return {
                            ...post,
                            description: action.editedData.description,
                        };
                    }
                    return post;
                }),
                allPosts: state.allPosts.map((post) => {
                    if (post._id === action.postId) {
                        return {
                            ...post,
                            description: action.editedData.description,
                        };
                    }
                    return post;
                }),
            };
        case "COMMENT_SUCCESS":
            return {
                ...state,
                posts: state.posts.map((post) => {
                    if (post._id === action.postId) {
                        return {
                            ...post,
                            comments: [...post.comments, action.Id],
                        };
                    }
                    return post;
                }),
                allPosts: state.allPosts.map((post) => {
                    if (post._id === action.postId) {
                        return {
                            ...post,
                            comments: [...post.comments, action.Id],
                        };
                    }
                    return post;
                }),
            };
        case "DELETE_POST_SUCCESS":
            return {
                ...state,
                posts: state.posts.filter((post) => post._id !== action.postId),
                allPosts: state.allPosts.filter((post) => post._id !== action.postId),
            };
        case "FILTER_REPORTED_POSTS":
            return {
                ...state,
                posts: state.posts.filter((post) => post._id !== action.targetId),
                allPosts: state.allPosts.filter((post) => post._id !== action.targetId),
            };
        case "RESET_POST_STATE":
            return {
                posts: [],
                allPosts: [],
                timeLineloading: false,
                loading: false,
                error: false,
                imgError: false,
                uploading: false,
                hasMorePosts: true,
                moreTimelinePosts: true,
            };

        default:
            return state;
    }
};

export default postReducer;
