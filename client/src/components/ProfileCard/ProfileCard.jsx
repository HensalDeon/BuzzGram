import Cover from "../../img/cover.jpg";
import { Link } from "react-router-dom";
import defProfile from "../../img/icon-accounts.svg";
import unfollow from "../../img/icon-flatUnfollow.svg";
import follow from "../../img/icon-flatFollow.svg";
import avatar from "../../img/icon-accounts.svg";
import "./ProfileCard.scss";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserPosts } from "../../api/PostsRequests";
import BeatLoader from "react-spinners/BeatLoader";
import PostView from "../Explore/PostView";
import Modal from "react-bootstrap/Modal";
import { followUser, unfollowUser } from "../../redux/actions/UserAction";
import toast from "react-hot-toast";
import { getTimelinePosts } from "../../redux/actions/PostAction";
const ProfileCard = ({ location }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.authReducer.authData);
    const { id } = useParams();
    const [currUser, setCurrUser] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [followers, setFollowers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [isFollowed, setIsFollowed] = useState(user?.following.includes(id));

    const toggleExpand = () => {
        setExpanded(!expanded);
    };
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const override = {
        display: "block",
        margin: "auto",
        marginTop: "20%",
    };

    const bioClassName = `truncate-text ${expanded ? "show-full-text" : ""}`;

    useEffect(() => {
        if (id || user._id) {
            getUserPosts(id || user._id)
                .then((res) => {
                    setLoading(false);
                    setCurrUser(res.data);
                    setFollowers(res.data.user.followers.length);
                })
                .catch(() => {
                    setLoading(false);
                });
        }
    }, [id, user._id]);

    const handleFollow = async () => {
        const loadingToastId = toast.loading("Following...");
        try {
            const response = await dispatch(followUser(id, user._id));
            if (response.success) {
                dispatch(getTimelinePosts(user._id));
                toast.success(<b>{response.message}</b>);
                setIsFollowed(!isFollowed);
                setFollowers((prev) => prev + 1);
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
    const handleUnFollow = async () => {
        const loadingToastId = toast.loading("Unfollowing...");
        handleClose();
        try {
            const response = await dispatch(unfollowUser(id, user._id));
            if (response.success) {
                dispatch(getTimelinePosts(user._id));
                toast.success(<b>{response.message}</b>);
                setIsFollowed(!isFollowed);
                setFollowers((prev) => prev - 1);
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

    return (
        <div className="ProfileCard" style={location === "profile" ? { overflowY: "auto" } : {}}>
            <div className="ProfileImages">
                <img src={currUser.user?.coverimage || Cover} alt="cover image" />
                <img
                    className={location === "profile" ? "profileImg" : ""}
                    src={currUser.user?.profileimage || defProfile}
                    alt="profile image"
                />
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Body style={{ width: "10rem" }}>
                    <img src={user.profileimage || avatar} alt="" />
                    <span className="lg-text pb-2">{isFollowed ? "Unfollow this user?" : "Follow this User?"}</span>
                    <div className="cover">
                        <button className="button modalButton" onClick={handleClose}>
                            No!
                        </button>
                        <button className="button modalButton" onClick={handleUnFollow}>
                            Yes!
                        </button>
                    </div>
                </Modal.Body>
            </Modal>

            {!loading ? (
                <>
                    <div className="ProfileName">
                        <span>
                            <span style={location === "profile" ? { fontSize: "20px", padding: "0 14px" } : {}}>
                                {currUser.user?.username}
                            </span>
                            {user._id !== currUser.user._id && (
                                <>
                                    {isFollowed ? (
                                        <img
                                            onClick={handleShow}
                                            style={{ width: "2.4em", position: "absolute", cursor: "pointer" }}
                                            src={unfollow}
                                            alt="unfollow"
                                        />
                                    ) : (
                                        <img
                                            onClick={handleFollow}
                                            style={{ width: "2.4em", position: "absolute", cursor: "pointer" }}
                                            src={follow}
                                            alt="unfollow"
                                        />
                                    )}
                                </>
                            )}
                        </span>
                        <p>{currUser.user?.fullname}</p>
                        <span className={bioClassName} onClick={toggleExpand}>
                            {currUser.user?.bio || "Write about yourself😊"}
                        </span>
                    </div>
                    <div className="followStatus">
                        <hr />
                        <div>
                            <div className="follow">
                                {/* <span>{currUser.user?.followers.length}</span> */}
                                <span>{followers}</span>
                                <span>Followers</span>
                            </div>
                            <div className="vl"></div>
                            <div className="follow">
                                <span>{currUser.user?.following.length}</span>
                                <span>Followings</span>
                            </div>

                            {currUser.user && (
                                <>
                                    <div className="vl"></div>
                                    <div className="follow">
                                        <span>{currUser.posts.length}</span>
                                        <span>Posts</span>
                                    </div>
                                </>
                            )}
                        </div>
                        <hr />
                        {location === "home" && (
                            <span className="profileView">
                                <Link to={`/profile/${user._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                    My Profile
                                </Link>
                            </span>
                        )}
                        {location === "profile" && (
                            <div className="Post">
                                <div className="explore">
                                    {currUser?.posts.map((post) => (
                                        <PostView postDtl={post} key={post._id} />
                                    ))}
                                    {currUser?.posts.length < 1 && (
                                        <b className="d-flex flex-row">
                                            No Posts Yet!<span className="material-symbols-outlined">photo_camera</span>
                                        </b>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <BeatLoader loading={loading} cssOverride={override} color="orange" speedMultiplier={1} />
            )}
        </div>
    );
};

ProfileCard.propTypes = {
    location: PropTypes.string.isRequired,
};

export default ProfileCard;
