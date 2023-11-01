const chatReducer = (
    state = {
        currentChatUser: null,
        onlineUsers: [],
        videoCall: undefined,
        voiceCall: undefined,
        incomingVideoCall: undefined,
        incomingVoiceCall: undefined,
    },
    action
) => {
    switch (action.type) {
        case "CURRENT_CHAT_USER":
            return { ...state, currentChatUser: action.data };
        case "SET_ONLINE_USERS":
            return { ...state, onlineUsers: action.data };
        case "LOG_OUT":
            return { ...state, currentChatUser: null };
        case "SET_VIDEO_CALL":
            return { ...state, videoCall: action.videoCall };
        case "SET_VOICE_CALL":
            return { ...state, voiceCall: action.voiceCall };
        case "SET_INCOMING_VOICE_CALL":
            return { ...state, incomingVoiceCall: action.incomingVoiceCall };
        case "SET_INCOMING_VIDEO_CALL":
            return { ...state, incomingVideoCall: action.incomingVideoCall };
        case "END_CALL":
            return {
                ...state,
                voiceCall: undefined,
                videoCall: undefined,
                incomingVideoCall: undefined,
                incomingVoiceCall: undefined,
            };
        default:
            return state;
    }
};
export default chatReducer;
