import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { followUser, unfollowUser } from "../../redux/actions/UserAction";
import toast, { Toaster } from "react-hot-toast";
import avatar from "../../img/icon-accounts.svg";
import { useState } from "react";
function Lists({ follower }) {
    const { user } = useSelector((state) => state.authReducer.authData);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isFollowed, setIsFollowed] = useState(user?.following.includes(follower?._id));
    const [loading, setLoading] = useState(false);
    const handleFollow = async () => {
        const loadingToastId = toast.loading("Following...");
        setLoading(true);
        try {
            const response = await dispatch(followUser(follower?._id, user._id));
            setLoading(false);
            console.log(response);
            if (response?.success) {
                toast.success(<b>{response?.message}</b>);
                setIsFollowed(!isFollowed);
            } else {
                toast.error(<b>{response?.error}</b>);
            }
            toast.dismiss(loadingToastId);
        } catch (error) {
            setLoading(false);
            toast.dismiss(loadingToastId);
            toast.error(<b>Cannot follow at the moment!</b>);
            console.error("Error:", error);
        }
    };

    const handleUnFollow = async () => {
        const loadingToastId = toast.loading("Unfollowing...");
        try {
            const response = await dispatch(unfollowUser(follower?._id, user._id));
            console.log(response);
            if (response?.success) {
                toast.success(<b>{response?.message}</b>);
                setIsFollowed(!isFollowed);
            } else {
                toast.error(<b>{response?.error}</b>);
            }
            toast.dismiss(loadingToastId);
        } catch (error) {
            toast.dismiss(loadingToastId);
            toast.error(<b>Can&#39;t Unfollow at the moment!</b>);
            console.error("Error:", error);
        }
    };
    return (
        <>
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            {follower._id !== user._id && (
                <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="follower pb-3 gap-1"
                >
                    <div onClick={() => navigate(`/profile/${follower?._id}`)} style={{ cursor: "pointer" }}>
                        <img src={follower?.profileimage || avatar} alt="" className="followerImage" />
                        <div className="name">
                            <span>{follower?.fullname}</span>
                            <span>@{follower?.username}</span>
                        </div>
                    </div>

                    <button
                        onClick={isFollowed ? handleUnFollow : handleFollow}
                        disabled={loading}
                        className="button fc-button"
                    >
                        {isFollowed ? "Unfollow" : "Follow"}
                    </button>
                </motion.div>
            )}
        </>
    );
}

Lists.propTypes = {
    follower: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        profileimage: PropTypes.string.isRequired,
        fullname: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
    }).isRequired,
};

export default Lists;
