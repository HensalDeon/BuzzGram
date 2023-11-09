// import { useRef, useState } from "react";
// import ChatBox from "../../components/Chatbox/Chatbox";
// import Conversation from "../../components/Conversation/Converstaion";
// import "./Chat.scss";
// import { useEffect } from "react";
// import { createChat, userChats } from "../../api/ChatRequests";
// import { useDispatch, useSelector } from "react-redux";
// import { io } from "socket.io-client";
// import { motion } from "framer-motion";
// import { logout } from "../../redux/actions/AuthActions";
// import IncomingVideo from "./IncomingVideo";
// import IncomingVoice from "./IncomingVoice";
// import Call from "./Call";
// function Chat() {
//     const socket = useRef();
//     const { user } = useSelector((state) => state.authReducer.authData);
//     const { currentChatUser, videoCall, voiceCall, onlineUsers, incomingVideoCall, incomingVoiceCall } = useSelector(
//         (state) => state.chatReducer
//     );
//     const dispatch = useDispatch();

//     const [chats, setChats] = useState([]);
//     const [currentChat, setCurrentChat] = useState(null);
//     const [sendMessage, setSendMessage] = useState(null);
//     const [receivedMessage, setReceivedMessage] = useState(null);

//     // Get the chat in chat section
//     useEffect(() => {
//         const getChats = async () => {
//             try {
//                 const { data } = await userChats(user._id);
//                 setChats(data);
//             } catch (error) {
//                 console.log(error);
//                 if (error.response.data.error == "Token has expired") {
//                     dispatch(logout());
//                 }
//             }
//         };

//         if (currentChatUser) {
//             const createNewChat = async () => {
//                 try {
//                     const ids = {
//                         senderId: user._id,
//                         receiverId: currentChatUser,
//                     };
//                     const { data } = await createChat(ids);
//                     setCurrentChat(data);
//                     getChats();
//                 } catch (error) {
//                     console.log(error);
//                     if (error.response.data.error == "Token has expired") {
//                         dispatch(logout());
//                     }
//                 }
//             };
//             createNewChat();
//         } else {
//             getChats();
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [currentChatUser, user._id]);

//     // Connect to Socket.io
//     useEffect(() => {
//         socket.current = io("ws://localhost:8800");
//         socket.current.emit("new-user-add", user._id);

//         socket.current.on("get-users", (users) => {
//             dispatch({ type: "SET_ONLINE_USERS", data: users });
//         });

//         socket.current.on("incoming-video-call", ({ from, roomId, callType }) => {
//             dispatch({
//                 type: "SET_INCOMING_VIDEO_CALL",
//                 incomingVideoCall: { ...from, roomId, callType },
//             });
//         });

//         socket.current.on("incoming-voice-call", ({ from, roomId, callType }) => {
//             console.log("incoming vannu");
//             dispatch({
//                 type: "SET_INCOMING_VOICE_CALL",
//                 incomingVoiceCall: { ...from, roomId, callType },
//             });
//         });

//         socket.current.on("video-call-rejected", () => {

//             dispatch({ type: "END_CALL" });
//         });

//         socket.current.on("voice-call-rejected", () => {
//             console.log("reject cheyth dispatch");
//             dispatch({ type: "END_CALL" });
//         });

//         socket.current.on("recieve-message", (data) => {
//             setReceivedMessage(data);
//         });
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [user]);

//     // Send Message to socket server
//     useEffect(() => {
//         if (sendMessage !== null) {
//             console.log("nmber of times");
//             socket.current.emit("send-message", sendMessage);
//         }
//     }, [sendMessage]);

//     // Send Vedio call to socket server
//     useEffect(() => {
//         if (videoCall && videoCall?.type == "out-going") {
//             console.log("video call sent");
//             socket.current.emit("outgoing-video-call", {
//                 to: videoCall?._id,
//                 from: {
//                     id: user._id,
//                     profileimage: user.profileimage,
//                     username: user.username,
//                 },
//                 callType: videoCall?.callType,
//                 roomID: videoCall?.roomID,
//             });
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [videoCall]);

//     useEffect(() => {
//         if (voiceCall && voiceCall?.type == "out-going") {
//             socket.current.emit("outgoing-voice-call", {
//                 to: voiceCall?._id,
//                 from: {
//                     id: user._id,
//                     profileimage: user.profileimage,
//                     username: user.username,
//                 },
//                 callType: voiceCall?.callType,
//                 roomID: voiceCall?.roomID,
//             });
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [voiceCall]);

//     const checkOnlineStatus = (chat) => {
//         const chatMember = chat.members.find((member) => member !== user._id);
//         const online = onlineUsers.find((user) => user.userId === chatMember);
//         return online ? true : false;
//     };

//     return (
//         <>
//             <motion.div
//                 initial={{ y: -20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//                 className="Chat"
//             >
//                 <div className="Left-side-chat">
//                     <div className="Chat-container">
//                         <div className="Chat-list">
//                             {chats?.map((chat) => (
//                                 <motion.div
//                                     initial={{ y: -20, opacity: 0 }}
//                                     animate={{ y: 0, opacity: 1 }}
//                                     transition={{ duration: 0.5 }}
//                                     key={chat._id}
//                                     onClick={() => {
//                                         setCurrentChat(chat);
//                                         const userId = chat.members.find((id) => id !== user._id);
//                                         dispatch({ type: "CURRENT_CHAT_USER", data: userId });
//                                     }}
//                                 >
//                                     <Conversation data={chat} currentUser={user._id} online={checkOnlineStatus(chat)} />
//                                 </motion.div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//                 <motion.div
//                     className="Right-side-chat"
//                     initial={{ y: -20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     transition={{ duration: 0.5 }}
//                 >
//                     {incomingVideoCall && <IncomingVideo data={incomingVideoCall} socket={socket} />}
//                     {incomingVoiceCall && <IncomingVoice data={incomingVoiceCall} socket={socket} />}
//                     {videoCall && <Call data={videoCall} socket={socket}/>}
//                     {voiceCall && <Call data={voiceCall} socket={socket}/>}

//                     <ChatBox
//                         chat={currentChat}
//                         currentUser={user._id}
//                         setSendMessage={setSendMessage}
//                         receivedMessage={receivedMessage}
//                         socket={socket}
//                     />
//                 </motion.div>
//             </motion.div>
//         </>
//     );
// }

// export default Chat;

import { useRef, useState } from "react";
import ChatBox from "../../components/Chatbox/Chatbox";
import Conversation from "../../components/Conversation/Converstaion";
import "./Chat.scss";
import { useEffect } from "react";
import { createChat, userChats } from "../../api/ChatRequests";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { logout } from "../../redux/actions/AuthActions";
import IncomingVideo from "./IncomingVideo";
import IncomingVoice from "./IncomingVoice";
import Call from "./Call";
import { createNotification } from "../../api/NotificationRequests";
function Chat({ peer, socket }) {
    const { user } = useSelector((state) => state.authReducer.authData);
    const { currentChatUser, videoCall, voiceCall, onlineUsers, incomingVideoCall, incomingVoiceCall } = useSelector(
        (state) => state.chatReducer
    );
    const dispatch = useDispatch();

    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [sendMessage, setSendMessage] = useState(null);
    const [notification, setNotification] = useState(null);
    const [receivedMessage, setReceivedMessage] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const localVideo = useRef();
    const remoteVideo = useRef();

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

    const endCall = () => {
        if (localStream) {
            const tracks = localStream.getTracks();
            if (tracks) {
                tracks.forEach((track) => track.stop());
            }
        }
        if (remoteStream) {
            const remoteTracks = remoteStream.getTracks();
            if (remoteTracks) {
                remoteTracks.forEach((track) => track.stop());
            }
        }

        // Reset local and remote streams
        setLocalStream(null);
        setRemoteStream(null);

        // Reset video elements
        if (localVideo.current) {
            localVideo.current.srcObject = null;
        }
        if (remoteVideo.current) {
            remoteVideo.current.srcObject = null;
        }
        // Reset the video call state
        dispatch({ type: "END_CALL" });
    };

    // Connect to Socket.io
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
            console.log("incoming vannu");
            dispatch({
                type: "SET_INCOMING_VOICE_CALL",
                incomingVoiceCall: { ...from, roomId, callType },
            });
        });

        socket.on("video-call-rejected", () => {
            // dispatch({ type: "END_CALL" });
            console.log("rejected:  ");
            endCall();
        });

        socket.on("voice-call-rejected", () => {
            console.log("reject cheyth dispatch");
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

    // Send Message to socket server
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
    }, [sendMessage]);

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

    const checkOnlineStatus = (chat) => {
        const chatMember = chat.members.find((member) => member !== user._id);
        const online = onlineUsers.find((user) => user.userId === chatMember);
        return online ? true : false;
    };

    const callPeer = () => {
        navigator.mediaDevices
            ?.getUserMedia({
                video: true,
                audio: true,
            })
            .then((stream) => {
                console.log(stream, "local stream from calling user");
                setLocalStream(stream);
                localVideo.current.srcObject = stream;

                const call_peer = peer.call(videoCall?._id, stream);

                call_peer.on("stream", (remoteStream) => {
                    console.log(remoteStream, "remote stream from answering user");
                    setRemoteStream(remoteStream);
                    remoteVideo.current.srcObject = remoteStream;
                });
            });
    };
    const answerPeer = () => {
        navigator.mediaDevices
            ?.getUserMedia({
                video: true,
                audio: true,
            })
            .then((stream) => {
                console.log(stream, "local stream");
                setLocalStream(stream);
                localVideo.current.srcObject = stream;
                console.log(peer, "///");
                peer.on("call", (call_peer) => {
                    call_peer.answer(stream);

                    call_peer.on("stream", (remoteStream) => {
                        console.log(remoteStream, "remote stream");
                        setRemoteStream(remoteStream);
                        remoteVideo.current.srcObject = remoteStream;
                    });

                    call_peer.on("close", () => {
                        console.log("user left call");
                    });
                });
            });
    };

    useEffect(() => {
        if (videoCall?.type == "out-going") {
            console.log("outgoing call");
            callPeer();
        }
        if (videoCall?.type == "in-coming") {
            console.log("incoming call");
            answerPeer();
        }
    }, [videoCall]);

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
                roomID: videoCall?.roomID,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoCall]);

    return (
        <>
            {/* <video
                ref={localVideo}
                muted
                autoPlay
                playsInline
                controls={false}
                style={{ position: "absolute", bottom: "0", left: "0", zIndex: 100, width: "100px", height: "100px" }}
            ></video>
            <video
                autoPlay
                playsInline
                controls={false}
                ref={remoteVideo}
                style={{ position: "absolute", bottom: "0", right: "0", zIndex: 100, width: "100px", height: "100px" }}
            ></video> */}
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
                    {videoCall && <Call data={videoCall} socket={socket} endConnection={endCall} />}
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

export default Chat;
