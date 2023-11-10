import PostSide from "../../components/PostSide/PostSide";
import { useEffect, useState } from "react";
import ProfileSide from "../../components/profileSide/ProfileSide";
import "./Home.scss";
import SideBar from "../../components/SideBar/SideBar";
import BottomBar from "../../components/BottomBar/BottomBar";
import PropTypes from "prop-types";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import Explore from "../../components/Explore/Explore";
import SavedPosts from "../../components/SavedPosts/SavedPosts";
import FollowersCard from "../../components/FollowersCard/FollowersCard";
import { motion } from "framer-motion";
import Chat from "../Chat/Chat";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../../api/UserRequests";
import { logout } from "../../redux/actions/AuthActions";
import socket from "../../utils/socket";
import bell from "../../img/icon-flatBellIcon.svg";
import { useRef } from "react";
import { getNotifications } from "../../api/NotificationRequests";
import Notification from "../../components/Notification/Notification";
import audioTone from "../../audio/pristine-609.mp3";
const Home = ({ location }) => {
    const { user } = useSelector((state) => state.authReducer.authData);
    const dispatch = useDispatch();
    const audioRef = useRef();
    const constraintsRef = useRef(null);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 930);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 450);
    const [notifications, setNotifications] = useState([]);
    const [notiLength, setNotiLength] = useState(0);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        (() => {
            getUser(user._id)
                .then(({ data }) => {
                    if (data.isblocked) {
                        dispatch(logout());
                    }
                })
                .catch((err) => {
                    console.log(err);
                    if (err.response.data.error == "Token has expired") {
                        dispatch(logout());
                    }
                });
                console.log("helloo");
        })();
    }, [location, user, dispatch]);

    useEffect(() => {
        socket.emit("new-user-add", { userId: user._id, peerId: user._id });
        socket.on("get-users", (users) => {
            dispatch({ type: "SET_ONLINE_USERS", data: users });
        });
        dispatch({ type: "SET_PEER_ID", id: user._id });
        socket.emit("new-user-add", { userId: user._id, peerId: user._id });
        socket.on("get-users", (users) => {
            dispatch({ type: "SET_ONLINE_USERS", data: users });
        });
        return () => {
            socket.off("new-user-add");
            socket.off("get-users");
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!showModal) {
            getNotifications(user._id).then(({ data }) => {
                setNotiLength(data?.length);
                setNotifications(data);
            });
        }
        socket.on("recieve-notification", (data) => {
            console.log(data, "recieved notification");
            audioRef.current.play();
            getNotifications(user._id).then(({ data }) => {
                setNotiLength(data?.length);
                setNotifications(data);
            });
        });
    }, [user, showModal]);

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 930);
            setIsSmallScreen(window.innerWidth <= 450);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="Home" ref={constraintsRef}>
            <audio controls ref={audioRef} style={{ display: "none" }}>
                <source src={audioTone} type="audio/mp3" />
            </audio>
            <Notification
                notifications={notifications}
                showModal={showModal}
                setShowModal={setShowModal}
                user={user}
                length={setNotiLength}
            />
            <motion.div drag dragConstraints={constraintsRef} initial={{ top: "3vh", right: "3vh" }} className="item">
                <span className="badge">{notiLength || 0}</span>
                <motion.img onClick={() => setShowModal(true)} className="w-100" src={bell} />
            </motion.div>

            {isSmallScreen ? <BottomBar /> : <SideBar />}
            {isLargeScreen && location == "home" && <ProfileSide location={location} />}
            {location === "chat" && <Chat socket={socket} />}
            {location === "home" && <PostSide />}
            {location === "explore" && <Explore />}
            {location === "saved" && <SavedPosts />}
            {location === "profile" && (
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                    <div className="d-flex flex-row gap-4">
                        <ProfileCard location={location} />
                        {isLargeScreen && <FollowersCard />}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

Home.propTypes = {
    location: PropTypes.string.isRequired,
};

export default Home;
