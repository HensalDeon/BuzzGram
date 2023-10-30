const chatReducer = (
    state = { chatUsers: [], chats: null, currentChatUser: null, loading: false, error: false },
    action
) => {
    switch (action.type) {
        case "SAVE_USER":
            return { ...state, chatUsers: [...state.chatUsers, action.data] };
        case "CURRENT_CHAT_USER":
            return { ...state, currentChatUser: action.data };
        default:
            return state;
    }
};
export default chatReducer;
