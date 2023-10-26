import "./FollowersCard.scss";
import { Followers } from "../../Data/FollwersData";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const FollowersCard = () => {
    const location = useLocation();
    return (
        <div
            className="FollowersCard"
            style={location.pathname.includes("/profile") ? { width: "40%", paddingRight: "2rem" } : {}}
        >
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                <h3>People you may know!</h3>
                {Followers.map((follower) => {
                    return (
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="follower pb-3 gap-1"
                            key={follower.id}
                        >
                            <div>
                                <img src={follower.img} alt="" className="followerImage" />
                                <div className="name">
                                    <span>{follower.name}</span>
                                    <span>@{follower.username}</span>
                                </div>
                            </div>
                            <button className="button fc-button">Follow</button>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
};

export default FollowersCard;
