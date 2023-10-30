import { useEffect, useState } from "react";
import { useRef } from "react";
import avatar from "../../img/icon-accounts.svg";
import sent from "../../img/icon-flatSent.svg";
import { addMessage, getMessages } from "../../api/MessageRequests";
import { getUser } from "../../api/UserRequests";
import "./Chatbox.scss";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

function Chatbox({ chat, currentUser, setSendMessage, receivedMessage }) {
    const [userData, setUserData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const handleChange = (newMessage) => {
        setNewMessage(newMessage);
    };

    // fetching data for header
    useEffect(() => {
        const userId = chat?.members?.find((id) => id !== currentUser);
        const getUserData = async () => {
            try {
                const { data } = await getUser(userId);
                setUserData(data);
            } catch (error) {
                console.log(error);
            }
        };

        if (chat !== null) getUserData();
    }, [chat, currentUser]);

    // fetch messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const { data } = await getMessages(chat._id);
                setMessages(data);
            } catch (error) {
                console.log(error);
            }
        };

        if (chat !== null) fetchMessages();
    }, [chat]);

    // Always scroll to last Message
    useEffect(() => {
        scroll.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Send Message
    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage) return;
        const message = {
            senderId: currentUser,
            text: newMessage,
            chatId: chat._id,
        };
        const receiverId = chat.members.find((id) => id !== currentUser);
        setSendMessage({ ...message, receiverId });
        try {
            const { data } = await addMessage(message);
            setMessages([...messages, data]);
            setNewMessage("");
        } catch {
            console.log("error");
        }
    };

    // Receive Message from parent component
    useEffect(() => {
        if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
            setMessages([...messages, receivedMessage]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [receivedMessage]);

    const scroll = useRef();
    // const imageRef = useRef();

    return (
        <>
            <div className="ChatBox-container">
                {chat ? (
                    <>
                        {/* chat-header */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="chat-header"
                        >
                            <div className="follower">
                                <img
                                    src={userData?.profileimage || avatar}
                                    alt="Profile"
                                    className="followerImage"
                                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                />
                                <div className="name" style={{ fontSize: "0.9rem" }}>
                                    <span>{userData?.username}</span>
                                </div>
                            </div>
                            <hr
                                style={{
                                    width: "100%",
                                    border: "0.1px solid #c0c0c0",
                                    marginTop: "20px",
                                }}
                            />
                        </motion.div>
                        {/* chat-body */}
                        <div className="chat-body">
                            {messages.map((message) => (
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    ref={scroll}
                                    key={message._id}
                                    className={message.senderId === currentUser ? "message own" : "message"}
                                >
                                    <span>{message.text}</span> <span>{format(message.createdAt)}</span>
                                </motion.div>
                            ))}
                        </div>
                        {/* chat-sender */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="chat-sender"
                        >
                            {/* <div onClick={() => imageRef.current.click()}>+</div> */}
                            <InputEmoji value={newMessage} onChange={handleChange} />
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                src={sent}
                                onClick={handleSend}
                            ></motion.img>
                            {/* <input type="file" style={{ display: "none" }} ref={imageRef} /> */}
                        </motion.div>
                    </>
                ) : (
                    <span className="chatbox-empty-message">Tap on a chat to start conversation...</span>
                )}
            </div>
        </>
    );
}

Chatbox.propTypes = {
    chat: PropTypes.object,
    currentUser: PropTypes.string.isRequired,
    setSendMessage: PropTypes.func.isRequired,
    receivedMessage: PropTypes.object,
};

export default Chatbox;
