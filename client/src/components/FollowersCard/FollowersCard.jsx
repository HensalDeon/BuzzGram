import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { randomUsers } from "../../api/UserRequests";
import Lists from "./Lists";
import "./FollowersCard.scss";

const FollowersCard = () => {
    const location = useLocation();
    const [users, setUsers] = useState([]);
    useEffect(() => {
        randomUsers().then(({ data }) => {
            setUsers(data);
        });
    }, []);
    return (
        <div
            className="FollowersCard px-1"
            style={location.pathname.includes("/profile") ? { width: "40%", paddingRight: "2rem" } : {}}
        >
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                <h3>People around you!</h3>
                {users?.map((follower) => (
                    <Lists follower={follower} key={follower?._id} />
                ))}
            </motion.div>
        </div>
    );
};

export default FollowersCard;
