import { useRef, useState } from "react";
import ChatBox from "../../components/Chatbox/Chatbox";
import Conversation from "../../components/Conversation/Converstaion";
import "./Chat.scss";
import { useEffect } from "react";
import { createChat, userChats } from "../../api/ChatRequests";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
function Chat() {
    const socket = useRef();
    const { user } = useSelector((state) => state.authReducer.authData);
    const { currentChatUser } = useSelector((state) => state.chatReducer);

    const [chats, setChats] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
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
                }
            };
            createNewChat();
        } else {
            getChats();
        }
    }, [currentChatUser, user._id]);

    // Connect to Socket.io
    useEffect(() => {
        socket.current = io("ws://localhost:8800");
        socket.current.emit("new-user-add", user._id);
        socket.current.on("get-users", (users) => {
            setOnlineUsers(users);
        });
    }, [user]);

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
                <ChatBox
                    chat={currentChat}
                    currentUser={user._id}
                    setSendMessage={setSendMessage}
                    receivedMessage={receivedMessage}
                />
            </motion.div>
        </motion.div>
    );
}

export default Chat;
