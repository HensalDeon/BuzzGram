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
import Peer from "peerjs";
import { useRef } from "react";
const Home = ({ location }) => {
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 930);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 450);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.authReducer.authData);
    const [peer, setPeer] = useState();
    const constraintsRef = useRef(null);

    useEffect(() => {
        (async () => {
            const { data } = await getUser(user._id);
            if (data.isblocked) {
                dispatch(logout());
            }
        })();
    }, [location, user, dispatch]);

    useEffect(() => {
        const peer = new Peer(user._id, { iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }] });
        peer.on("open", (id) => {
            socket.emit("new-user-add", { userId: user._id, peerId: id });
            socket.on("get-users", (users) => {
                dispatch({ type: "SET_ONLINE_USERS", data: users });
            });
            dispatch({ type: "SET_PEER_ID", id: id });
            setPeer(peer);
        });
        return () => {
            peer.destroy();
            socket.off("new-user-add");
            socket.off("get-users");
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
            <motion.div initial={{ bottom: "5vw", right: "2vw" }} className="item" drag dragConstraints={constraintsRef} />
            {isSmallScreen ? <BottomBar /> : <SideBar />}
            {isLargeScreen && location == "home" && <ProfileSide location={location} />}
            {location === "chat" && <Chat peer={peer} socket={socket} />}
            {location === "home" && <PostSide />}
            {location === "explore" && <Explore />}
            {location === "saved" && <SavedPosts />}
            {location === "profile" && (
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                    <div className="d-flex flex-row">
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
