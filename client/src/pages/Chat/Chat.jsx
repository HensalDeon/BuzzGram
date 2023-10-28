// import { useRef, useState } from "react";
// import ChatBox from "../../components/Chatbox/Chatbox";
// import Conversation from "../../components/Conversation/Converstaion";
// import "./Chat.scss";
// import { useEffect } from "react";
// import { userChats } from "../../api/ChatRequests";
// import { useSelector } from "react-redux";
// import { io } from "socket.io-client";
// function Chat() {
//     const socket = useRef();
//     const { user } = useSelector((state) => state.authReducer.authData);

//     const [chats, setChats] = useState([]);
//     const [onlineUsers, setOnlineUsers] = useState([]);
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
//             }
//         };
//         getChats();
//     }, [user._id]);

//     // Connect to Socket.io
//     useEffect(() => {
//         socket.current = io("ws://localhost:8800");
//         socket.current.emit("new-user-add", user._id);
//         socket.current.on("get-users", (users) => {
//             setOnlineUsers(users);
//         });
//     }, [user]);

//     // Send Message to socket server
//     useEffect(() => {
//         if (sendMessage !== null) {
//             socket.current.emit("send-message", sendMessage);
//         }
//     }, [sendMessage]);

//     // Get the message from socket server
//     useEffect(() => {
//         socket.current.on("recieve-message", (data) => {
//             console.log(data);
//             setReceivedMessage(data);
//         });
//     }, []);

//     const checkOnlineStatus = (chat) => {
//         const chatMember = chat.members.find((member) => member !== user._id);
//         const online = onlineUsers.find((user) => user.userId === chatMember);
//         return online ? true : false;
//     };

//     return (
//         <div className="Chat">
//             <div className="Left-side-chat">
//                 <div className="Chat-container">
//                     <div className="Chat-list">
//                         {chats.map((chat) => (
//                             <div
//                                 key={chat._id}
//                                 onClick={() => {
//                                     setCurrentChat(chat);
//                                 }}
//                             >
//                                 <Conversation data={chat} currentUser={user._id} online={checkOnlineStatus(chat)} />
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//             <div className="Right-side-chat">
//                 <ChatBox
//                     chat={currentChat}
//                     currentUser={user._id}
//                     setSendMessage={setSendMessage}
//                     receivedMessage={receivedMessage}
//                 />
//             </div>
//         </div>
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
import { io } from "socket.io-client";
function Chat() {
    const socket = useRef();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.authReducer.authData);
    const { chats } = useSelector((state) => state.chatReducer);
    const { currentChatUser } = useSelector((state) => state.chatReducer);

    console.log(chats, "////");

    // const [chats, setChats] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [sendMessage, setSendMessage] = useState(null);
    const [receivedMessage, setReceivedMessage] = useState(null);

    // Get the chat in chat section
    useEffect(() => {
        const getChats = async () => {
            try {
                const { data } = await userChats(user._id);
                // setChats(data);
                dispatch({ type: "SET_CHATS", data: data });
            } catch (error) {
                console.log(error);
            }
        };

        console.log(currentChatUser, "curent user out");
        if (currentChatUser) {
            const createNewChat = async () => {
                console.log(currentChatUser, "curent user");
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
    }, [user._id]);

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
            console.log(data);
            setReceivedMessage(data);
        });
    }, []);

    const checkOnlineStatus = (chat) => {
        const chatMember = chat.members.find((member) => member !== user._id);
        const online = onlineUsers.find((user) => user.userId === chatMember);
        return online ? true : false;
    };

    return (
        <div className="Chat">
            <div className="Left-side-chat">
                <div className="Chat-container">
                    <div className="Chat-list">
                        {chats?.map((chat) => (
                            <div
                                key={chat._id}
                                onClick={() => {
                                    setCurrentChat(chat);
                                }}
                            >
                                {console.log(chat)}
                                <Conversation data={chat} currentUser={user._id} online={checkOnlineStatus(chat)} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="Right-side-chat">
                <ChatBox
                    chat={currentChat}
                    currentUser={user._id}
                    setSendMessage={setSendMessage}
                    receivedMessage={receivedMessage}
                />
            </div>
        </div>
    );
}

export default Chat;
