import "./Chat.scss";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { createChat, userChats } from "../../api/ChatRequests";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { logout } from "../../redux/actions/AuthActions";
import { createNotification } from "../../api/NotificationRequests";
import { leave } from "../../utils/agora";
import Conversation from "../../components/Conversation/Converstaion";
import ChatBox from "../../components/Chatbox/Chatbox";
import IncomingVideo from "./IncomingVideo";
import IncomingVoice from "./IncomingVoice";
import Call from "./Call";
import ringtone from "../../audio/ringtone.mp3";
import PropTypes from "prop-types";

function Chat({ socket }) {
    const { user } = useSelector((state) => state.authReducer.authData);
    const { currentChatUser, videoCall, voiceCall, onlineUsers, incomingVideoCall, incomingVoiceCall } = useSelector(
        (state) => state.chatReducer
    );
    const audioRef = useRef();
    const dispatch = useDispatch();
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [sendMessage, setSendMessage] = useState(null);
    const [notification, setNotification] = useState(null);
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

        // if already opened someones chat show that first
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

    // setup socket events
    useEffect(() => {
        socket.on("get-users", (users) => {
            dispatch({ type: "SET_ONLINE_USERS", data: users });
        });

        socket.on("incoming-video-call", ({ from, roomId, callType }) => {
            dispatch({
                type: "SET_INCOMING_VIDEO_CALL",
                incomingVideoCall: { ...from, roomId, callType },
            });
        });

        socket.on("incoming-voice-call", ({ from, roomId, callType }) => {
            dispatch({
                type: "SET_INCOMING_VOICE_CALL",
                incomingVoiceCall: { ...from, roomId, callType },
            });
        });

        socket.on("video-call-rejected", () => {
            leave();
            dispatch({ type: "END_CALL" });
        });

        socket.on("voice-call-rejected", () => {
            dispatch({ type: "END_CALL" });
        });

        socket.on("recieve-message", (data) => {
            setReceivedMessage(data);
            setChats((prevChats) => {
                const chatIndex = prevChats.findIndex((chat) => {
                    return chat._id === data.chatId;
                });
                if (chatIndex !== -1) {
                    const updatedChats = [...prevChats];
                    updatedChats[chatIndex].lastMessage = data;
                    return updatedChats;
                }
                return prevChats;
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Send Message/Notification to socket server
    useEffect(() => {
        if (sendMessage !== null) {
            createNotification(notification).then(({ data }) => {
                socket.emit("get-notification", {
                    to: data.receiverId || notification.receiverId,
                    from: {
                        id: user._id,
                        profileimage: user.profileimage,
                        username: user.username,
                    },
                    text: data.text || notification.text,
                    description: data.description || notification.description,
                });
            });
            socket.emit("send-message", sendMessage);
            setChats((prevChats) => {
                const chatIndex = prevChats.findIndex((chat) => {
                    return chat._id === sendMessage.chatId;
                });
                if (chatIndex !== -1) {
                    const updatedChats = [...prevChats];
                    updatedChats[chatIndex].lastMessage = sendMessage;
                    return updatedChats;
                }
                return prevChats;
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sendMessage]);

    // send voice call ans setup call component
    useEffect(() => {
        if (voiceCall && voiceCall?.type == "out-going") {
            socket.emit("outgoing-voice-call", {
                to: voiceCall?._id,
                from: {
                    id: user._id,
                    profileimage: user.profileimage,
                    username: user.username,
                },
                callType: voiceCall?.callType,
                roomID: voiceCall?.roomID,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [voiceCall]);

    // check users who are online
    const checkOnlineStatus = (chat) => {
        const chatMember = chat.members.find((member) => member !== user._id);
        const online = onlineUsers.find((user) => user.userId === chatMember);
        return online ? true : false;
    };

    // Send Vedio call to socket server and set call component
    useEffect(() => {
        if (videoCall && videoCall?.type == "out-going") {
            console.log("helooo");
            socket.emit("outgoing-video-call", {
                to: videoCall?._id,
                from: {
                    id: user._id,
                    profileimage: user.profileimage,
                    username: user.username,
                },
                callType: videoCall?.callType,
                roomID: videoCall?.roomID,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoCall]);

    // setting ringtone for incoming call
    useEffect(() => {
        let interval;
        if (incomingVideoCall || incomingVoiceCall) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            interval = setInterval(() => {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            }, 8000);
        } else {
            clearInterval(interval);
            audioRef.current.pause();
        }
        return () => clearInterval(interval);
    }, [incomingVideoCall, incomingVoiceCall]);

    return (
        <>
            <audio ref={audioRef} style={{ display: "none" }}>
                <source src={ringtone} type="audio/mp3" />
            </audio>
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
                                    <Conversation
                                        data={chat}
                                        currentUser={user._id}
                                        online={checkOnlineStatus(chat)}
                                        socket={socket}
                                    />
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
                    {videoCall && <Call data={videoCall} socket={socket} />}
                    {voiceCall && <Call data={voiceCall} socket={socket} />}

                    <ChatBox
                        chat={currentChat}
                        currentUser={user._id}
                        setSendMessage={setSendMessage}
                        receivedMessage={receivedMessage}
                        setNotification={setNotification}
                        socket={socket}
                    />
                </motion.div>
            </motion.div>
        </>
    );
}

Chat.propTypes = {
    socket: PropTypes.object,
};

export default Chat;
