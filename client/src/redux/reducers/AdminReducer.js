const adminReducer = (state = { userDetails: null, loading: false, error: null }, action) => {
    switch (action.type) {
        case "FETCH_USERS_START":
            return { ...state, loading: true, error: null };
        case "FETCH_USERS_SUCCESS":
            return { ...state, userDetails: action.data, loading: false, error: null };
        case "FETCH_USERS_FAIL":
            return { ...state, loading: false, error: action.error };
        case "BLOCK_USER":
            return {
                ...state,
                userDetails: state.userDetails.map((user) => {
                    if (user._id === action.userId) {
                        return {
                            ...user,
                            isblocked: true,
                        };
                    }
                    return user;
                }),
            };
        case "UNBLOCK_USER":
            return {
                ...state,
                userDetails: state.userDetails.map((user) => {
                    if (user._id === action.userId) {
                        return {
                            ...user,
                            isblocked: false,
                        };
                    }
                    return user;
                }),
            };
        default:
            return state;
    }
};

export default adminReducer;
