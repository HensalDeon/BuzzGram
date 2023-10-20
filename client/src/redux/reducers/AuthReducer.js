const authReducer = (state = { authData: null, loading: false, error: null, updateLoading: false }, action) => {
    switch (action.type) {
        case "AUTH_START":
            return { ...state, loading: true, error: null };
        case "AUTH_SUCCESS":
            localStorage.setItem("profile", JSON.stringify({ ...action?.data }));
            return { ...state, authData: action.data, loading: false, error: null };
        case "AUTH_FAIL":
            return { ...state, loading: false, error: action.error };
        case "ADMIN_AUTH_START":
            return { ...state, adminLoading: true, adminError: null };
        case "ADMIN_AUTH_SUCCESS":
            localStorage.setItem("admin", JSON.stringify({ ...action?.data }));
            return { ...state, adminAuthData: action.data, adminLoading: false, adminError: null };
        case "ADMIN_AUTH_FAIL":
            return { ...state, adminLoading: false, adminError: action.error };
        case "PROFILE_UPLOAD_SUCCESS":
            return {
                ...state,
                authData: {
                    ...state.authData,
                    user: {
                        ...state.authData.user,
                        profileimage: action.data,
                    },
                },
            };
        case "COVER_UPLOAD_SUCCESS":
            return {
                ...state,
                authData: {
                    ...state.authData,
                    user: {
                        ...state.authData.user,
                        coverimage: action.data,
                    },
                },
            };
        case "UPDATING_START":
            return { ...state, updateLoading: true, error: null };
        case "UPDATING_SUCCESS": {
            const updatedUser = { ...state.authData.user, ...action.data.user };
            const updatedToken = state.authData.token;
            const updatedData = {
                user: updatedUser,
                token: updatedToken,
            };
            localStorage.setItem("profile", JSON.stringify(updatedData));

            return {
                ...state,
                authData: {
                    user: updatedUser,
                    token: updatedToken,
                },
                updateLoading: false,
                error: null,
            };
        }
        case "UPDATING_FAIL":
            return { ...state, updateLoading: false, error: action.error };
        case "LOG_OUT":
            // localStorage.clear();
            localStorage.removeItem("profile");
            localStorage.removeItem("expPage");
            localStorage.removeItem("timelinePage");
            return { ...state, authData: null, loading: false, error: null, updateLoading: false };
        case "ADMIN_LOG_OUT":
            return { ...state, adminAuthData: null, adminLoading: false, adminError: null };
        case "FOLLOW_USER":
            return {
                ...state,
                authData: {
                    ...state.authData,
                    user: { ...state.authData.user, following: [...state.authData.user.following, action.data] },
                },
            };
        case "UNFOLLOW_USER":
            return {
                ...state,
                authData: {
                    ...state.authData,
                    user: {
                        ...state.authData.user,
                        following: [...state.authData.user.following.filter((personId) => personId !== action.data)],
                    },
                },
            };
        case "BLOCK_USER":
            return {
                ...state,
                authData: {
                    ...state.authData,
                    user: {
                        ...state.authData.user,
                        isblocked: true,
                    },
                },
            };

        case "UNBLOCK_USER":
            return {
                ...state,
                authData: {
                    ...state.authData,
                    user: {
                        ...state.authData.user,
                        isblocked: false,
                    },
                },
            };
        case "UPDATE_SAVED":
            return {
                ...state,
                authData: {
                    ...state.authData,
                    user: {
                        ...state.authData.user,
                        saved: action.isSaved
                            ? state.authData.user.saved.filter((postId) => postId !== action.postId)
                            : [...state.authData.user.saved, action.postId],
                    },
                },
            };

        default:
            return state;
    }
};

export default authReducer;
