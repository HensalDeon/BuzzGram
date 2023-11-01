import { useRef, useState } from "react";
import ChatBox from "../../components/Chatbox/Chatbox";
import Conversation from "../../components/Conversation/Converstaion";
import "./Chat.scss";
import { useEffect } from "react";
import { createChat, userChats } from "../../api/ChatRequests";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import { logout } from "../../redux/actions/AuthActions";
import IncomingVideo from "./IncomingVideo";
import IncomingVoice from "./IncomingVoice";

function Chat() {
    const socket = useRef();
    const { user } = useSelector((state) => state.authReducer.authData);
    const { currentChatUser, videoCall, voiceCall, onlineUsers, incomingVideoCall, incomingVoiceCall } = useSelector(
        (state) => state.chatReducer
    );
    const dispatch = useDispatch();

    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [sendMessage, setSendMessage] = useState(null);
    const [receivedMessage, setReceivedMessage] = useState(null);

    // Get the chat in chat section
    useEffect(() => {
        const getChats = async () => {
            try {
                const { data } = await userChats(user._id);
                setChats(data);
            } catch (error) {
                console.log(error);
                if (error.response.data.error == "Token has expired") {
                    dispatch(logout());
                }
            }
        };

        if (currentChatUser) {
            const createNewChat = async () => {
                try {
                    const ids = {
                        senderId: user._id,
                        receiverId: currentChatUser,
                    };
                    const { data } = await createChat(ids);
                    setCurrentChat(data);
                    getChats();
                } catch (error) {
                    console.log(error);
                    if (error.response.data.error == "Token has expired") {
                        dispatch(logout());
                    }
                }
            };
            createNewChat();
        } else {
            getChats();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentChatUser, user._id]);

    // Connect to Socket.io
    useEffect(() => {
        socket.current = io("ws://localhost:8800");
        socket.current.emit("new-user-add", user._id);

        socket.current.on("get-users", (users) => {
            dispatch({ type: "SET_ONLINE_USERS", data: users });
        });

        socket.current.on("incoming-video-call", ({ from, roomId, callType }) => {
            dispatch({
                type: "SET_INCOMING_VIDEO_CALL",
                incomingVideoCall: { ...from, roomId, callType },
            });
        });

        socket.current.on("incoming-voice-call", ({ from, roomId, callType }) => {
            console.log("entered incoming", from, roomId, callType);
            dispatch({
                type: "SET_INCOMING_VOICE_CALL",
                incomingVoiceCall: { ...from, roomId, callType },
            });
        });

        socket.current.on("video-call-rejected", () => {
            dispatch({ type: "END_CALL" });
        });

        socket.current.on("voice-call-rejected", () => {
            dispatch({ type: "END_CALL" });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Send Message to socket server
    useEffect(() => {
        if (sendMessage !== null) {
            socket.current.emit("send-message", sendMessage);
        }
    }, [sendMessage]);

    // Send Vedio call to socket server
    useEffect(() => {
        if (videoCall && videoCall?.type == "out-going") {
            socket.current.emit("outgoing-video-call", {
                to: videoCall?._id,
                from: {
                    id: user._id,
                    profileimage: user.profileimage,
                    username: user.username,
                },
                callType: videoCall?.callType,
                roomId: videoCall?.roomId,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoCall]);

    useEffect(() => {
        if (voiceCall && voiceCall?.type == "out-going") {
            socket.current.emit("outgoing-voice-call", {
                to: voiceCall?._id,
                from: {
                    id: user._id,
                    profileimage: user.profileimage,
                    username: user.username,
                },
                callType: voiceCall?.callType,
                roomId: voiceCall?.roomId,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [voiceCall]);

    // Send Message to socket server
    useEffect(() => {
        if (sendMessage !== null) {
            socket.current.emit("send-message", sendMessage);
        }
    }, [sendMessage]);

    // Get the message from socket server
    useEffect(() => {
        socket.current.on("recieve-message", (data) => {
            setReceivedMessage(data);
        });
    }, []);

    const checkOnlineStatus = (chat) => {
        const chatMember = chat.members.find((member) => member !== user._id);
        const online = onlineUsers.find((user) => user.userId === chatMember);
        return online ? true : false;
    };

    return (
        <>
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="Chat"
            >
                <div className="Left-side-chat">
                    <div className="Chat-container">
                        <div className="Chat-list">
                            {chats?.map((chat) => (
                                <motion.div
                                    initial={{ y: -20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    key={chat._id}
                                    onClick={() => {
                                        setCurrentChat(chat);
                                        const userId = chat.members.find((id) => id !== user._id);
                                        dispatch({ type: "CURRENT_CHAT_USER", data: userId });
                                    }}
                                >
                                    <Conversation data={chat} currentUser={user._id} online={checkOnlineStatus(chat)} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
                <motion.div
                    className="Right-side-chat"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {incomingVideoCall && <IncomingVideo data={incomingVideoCall} socket={socket} />}
                    {incomingVoiceCall && <IncomingVoice data={incomingVoiceCall} socket={socket} />}
                    <ChatBox
                        chat={currentChat}
                        currentUser={user._id}
                        setSendMessage={setSendMessage}
                        receivedMessage={receivedMessage}
                        socket={socket}
                    />
                </motion.div>
            </motion.div>
        </>
    );
}

export default Chat;
