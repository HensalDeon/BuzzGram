import Modal from "react-bootstrap/Modal";
import { motion } from "framer-motion";
import "../FollowersCard/FollowersCard.scss";
import follow from "../../img/icon-flatFollow.svg";
import unfollow from "../../img/icon-flatUnfollow.svg";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import { followUser, unfollowUser } from "../../redux/actions/UserAction";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
function LikedUsersDetail({ usersToShow, userDetails, setUsersToShow, currUser }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [follows, setFollows] = useState(currUser?.following);
    const logedUser = useSelector((state) => state.authReducer.authData.user);

    const handleFollow = async (id) => {
        const loadingToastId = toast.loading("Following...");
        try {
            const response = await dispatch(followUser(id, currUser._id));
            if (response.success) {
                setFollows((prev) => [...prev, id]);
                toast.success(<b>{response.message}</b>);
            } else {
                toast.error(<b>{response.error}</b>);
            }
            toast.dismiss(loadingToastId);
        } catch (error) {
            toast.dismiss(loadingToastId);
            toast.error(<b>Cannot follow at the moment!</b>);
            console.error("Error:", error);
        }
    };

    const handleUnFollow = async (id) => {
        const loadingToastId = toast.loading("Unfollowing...");
        try {
            const response = await dispatch(unfollowUser(id, currUser._id));
            if (response.success) {
                const updatedFollows = follows.filter((followId) => followId !== id);
                setFollows(updatedFollows);
                toast.success(<b>{response.message}</b>);
            } else {
                toast.error(<b>{response.error}</b>);
            }
            toast.dismiss(loadingToastId);
        } catch (error) {
            toast.dismiss(loadingToastId);
            toast.error(<b>Can&#39;t Unfollow at the moment!</b>);
            console.error("Error:", error);
        }
    };

    // useEffect(() => {
    //     const handleScroll = () => {
    //         const modalBody = modalBodyRef.current;
    //         if (modalBody) {
    //             if (modalBody.scrollTop + modalBody.clientHeight >= modalBody.scrollHeight) {
    //                 console.log("heloo");
    //             }
    //         }
    //     };
    //     modalBodyRef.current.addEventListener("scroll", handleScroll);
    //     return () => {
    //         const modalBody = modalBodyRef.current;
    //         if (modalBody) {
    //             modalBody.removeEventListener("scroll", handleScroll);
    //         }
    //     };
    // }, [userDetails]);
    return (
        <Modal show={usersToShow} onHide={() => setUsersToShow(false)}>
            <Modal.Body style={{ overflow: "scroll", maxHeight: "14rem" }}>
                {userDetails.map((user) => {
                    return (
                        <div key={user._id} className="d-flex flex-column align-items-center">
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                key={user._id}
                                className="d-flex flex-column py-1 px-1 background"
                                style={{ width: "17rem", borderRadius: "1rem" }}
                            >
                                <div className="d-flex gap-5 justify-content-between">
                                    <div className="d-flex gap-3 align-items-center">
                                        <img
                                            style={{ width: "3rem" }}
                                            className="rounded-circle"
                                            src={user?.profileimage}
                                            alt="avatar"
                                        />
                                        <div
                                            className="d-flex flex-column"
                                            onClick={() => navigate(`/profile/${user._id}`, setUsersToShow(false))}
                                        >
                                            <span className="text-white text-left">{user?.username}</span>
                                            <span className="text-white align-self-start">{user?.fullname}</span>
                                        </div>
                                    </div>
                                    {user._id !== logedUser._id &&
                                        (follows.includes(user._id) ? (
                                            <motion.img
                                                whileHover={{ scale: 1.2 }}
                                                whileTap={{ scale: 0.9 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                                src={unfollow}
                                                style={{ width: "2.5rem", cursor: "pointer" }}
                                                onClick={() => handleUnFollow(user._id)}
                                            />
                                        ) : (
                                            <motion.img
                                                whileHover={{ scale: 1.2 }}
                                                whileTap={{ scale: 0.9 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                                src={follow}
                                                style={{ width: "2.5rem", cursor: "pointer" }}
                                                onClick={() => handleFollow(user._id)}
                                            />
                                        ))}
                                </div>
                            </motion.div>
                            <div className="bg-bottom"></div>
                        </div>
                    );
                })}
            </Modal.Body>
        </Modal>
    );
}

LikedUsersDetail.propTypes = {
    usersToShow: PropTypes.bool.isRequired,
    userDetails: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string.isRequired,
            username: PropTypes.string,
            profileimage: PropTypes.string,
        })
    ).isRequired,
    setUsersToShow: PropTypes.func.isRequired,
    currUser: PropTypes.object.isRequired,
};
export default LikedUsersDetail;
