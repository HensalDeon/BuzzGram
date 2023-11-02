import { useEffect, useState } from "react";
import { useRef } from "react";
import avatar from "../../img/icon-accounts.svg";
import sent from "../../img/icon-flatSent.svg";
import share from "../../img/icon-flatShare.svg";
import close from "../../img/icon-flatCloseBtn.svg";
import vedioIcon from "../../img/icon-flatVedioCall.svg";
import callIcon from "../../img/icon-flatCallIcon.svg";
import { addMessage, getMessages } from "../../api/MessageRequests";
import { getUser } from "../../api/UserRequests";
import "./Chatbox.scss";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import Modal from "react-bootstrap/Modal";
import toast, { Toaster } from "react-hot-toast";
import { uploadImage } from "../../api/UploadRequest";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Call from "../../pages/Chat/Call";

function Chatbox({ chat, currentUser, setSendMessage, receivedMessage, socket }) {
    const imageRef = useRef();
    const scroll = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userData, setUserData] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [media, setMedia] = useState(null);
    const [showMedia, setShowMedia] = useState(false);
    const [shareLoading, setShareLoading] = useState(false);
    const { videoCall, voiceCall } = useSelector((state) => state.chatReducer);

    const handleVideoCall = () => {
        dispatch({
            type: "SET_VIDEO_CALL",
            videoCall: {
                ...userData,
                type: "out-going",
                callType: "video",
                roomId: Date.now(),
            },
        });
    };
    const handleVoiceCall = () => {
        console.log("voice call");
        dispatch({
            type: "SET_VOICE_CALL",
            voiceCall: {
                ...userData,
                type: "out-going",
                callType: "voice",
                roomId: Date.now(),
            },
        });
    };

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
        console.log("send message");
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

    const handleShowMedia = () => setShowMedia(true);
    const handleCloseMedia = () => {
        console.log("close aayao");
        setShowMedia(false);
        // setMedia(null);
    };

    const handleMediaShare = () => {
        imageRef.current.value = null;
        imageRef.current.click();
    };

    const handleMediaChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            let img = e.target.files[0];

            console.log(img, "image");

            const fileExtension = img.name
                .split(".")
                .pop()
                .toLowerCase();

            const allowedExtensions = ["jpg", "jpeg", "png"];

            if (allowedExtensions.includes(fileExtension)) {
                setMedia({
                    name: img.name,
                    url: URL.createObjectURL(img),
                    file: img,
                });
                handleShowMedia();
            } else {
                setMedia(null);
                return toast.error(<b>Invalid file type. Please select a JPG, JPEG, or PNG image.</b>);
            }
        }
    };

    const handleMediaUpload = async (e) => {
        console.log("just loging upload");
        e.preventDefault();

        if (!media) return toast.error(<b>Please Provide an Image...!</b>);

        const formData = new FormData();
        formData.append("file", media.file);
        try {
            const loadingToast = toast.loading(<b>sharing...!</b>);
            setShareLoading(true);
            const response = await uploadImage(formData);
            if (response && response.data.url) {
                toast.dismiss(loadingToast);
                const message = {
                    senderId: currentUser,
                    media: response.data.url,
                    chatId: chat._id,
                };
                const receiverId = chat.members.find((id) => id !== currentUser);
                setSendMessage({ ...message, receiverId });
                try {
                    console.log("entered 12");
                    const { data } = await addMessage(message);
                    setShareLoading(false);
                    setMessages([...messages, data]);
                    handleCloseMedia();
                } catch (error) {
                    console.log("Error sending media message:", error);
                }
            }
        } catch (error) {
            handleCloseMedia();
            setShareLoading(false);
            console.log(error);
        }
    };

    const handleImageClick = (imageURL) => {
        setSelectedImage(imageURL);
        setImageModalOpen(true);
    };

    const closeImageModal = () => {
        setSelectedImage("");
        setImageModalOpen(false);
    };

    return (
        <>
            <Toaster position="top-center" reverseOrder={false}></Toaster>
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
                            <div className="d-flex justify-content-between">
                                <div className="follower">
                                    <img
                                        src={userData?.profileimage || avatar}
                                        alt="Profile"
                                        className="followerImage"
                                        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                    />
                                    <div
                                        className="name"
                                        style={{ fontSize: "0.9rem" }}
                                        onClick={() => navigate(`/profile/${userData._id}`)}
                                    >
                                        <span>{userData?.username}</span>
                                    </div>
                                </div>
                                <div className="d-flex gap-3 px-2">
                                    <motion.img
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                        className="vedio-icon"
                                        src={vedioIcon}
                                        alt="video icon"
                                        onClick={handleVideoCall}
                                    />
                                    <motion.img
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                        className="call-icon"
                                        src={callIcon}
                                        alt="video icon"
                                        onClick={handleVoiceCall}
                                    />
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
                        {imageModalOpen && (
                            <div className="image-modal">
                                <motion.img
                                    className="imageView"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        duration: 0.8,
                                        ease: [0, 0.71, 0.2, 1.01],
                                    }}
                                    src={selectedImage}
                                    alt="Selected Media"
                                />
                                <img className="close" src={close} onClick={() => closeImageModal()} />
                            </div>
                        )}
                        {/* {(videoCall || voiceCall) && <Call data={userData} socket={socket} />} */}
                        {videoCall && <Call data={videoCall} socket={socket} />}
                        {voiceCall && <Call data={voiceCall} socket={socket} />}

                        <div className="chat-body">
                            {messages.map((message,index) => (
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    ref={scroll}
                                    key={index}
                                    className={message.senderId === currentUser ? "message own" : "message"}
                                >
                                    {message.text && <span>{message.text}</span>}
                                    {message.media && (
                                        <div className="message-media" onClick={() => handleImageClick(message.media)}>
                                            <img src={message.media} alt="Media" />
                                        </div>
                                    )}
                                    <span>{format(message.createdAt)}</span>
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
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                src={share}
                                onClick={handleMediaShare}
                            />
                            <InputEmoji value={newMessage} onChange={handleChange} />
                            <motion.img
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                src={sent}
                                onClick={handleSend}
                            ></motion.img>
                            <input type="file" style={{ display: "none" }} ref={imageRef} onChange={handleMediaChange} />
                        </motion.div>
                    </>
                ) : (
                    <span className="chatbox-empty-message">Tap on a chat to start conversation...</span>
                )}
            </div>
            <Modal show={showMedia} onHide={handleCloseMedia} backdrop="static">
                <Modal.Body>
                    <img className="media-share" src={media?.url} alt="checking share media" />
                    <div className="d-flex flex-row-reverse pt-3 px-2 gap-2">
                        <button className="button modaButton px-3" onClick={handleMediaUpload} disabled={shareLoading}>
                            Share
                        </button>
                        <button onClick={handleCloseMedia} className="button modaButton px-3 py-1" disabled={shareLoading}>
                            Cancel
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
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
