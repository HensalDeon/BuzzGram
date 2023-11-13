import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, likePost, savePost, updatePost } from "../../redux/actions/PostAction";
import { createReport } from "../../redux/actions/ReportActions";
import { createComment } from "../../redux/actions/CommentActions";
import { useNavigate } from "react-router-dom";
import { createNotification } from "../../api/NotificationRequests";
import { followUser, unfollowUser } from "../../redux/actions/UserAction";
import { getLikedUsersDetail } from "../../api/PostsRequests";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import toast from "react-hot-toast";
import Heart from "../../img/like.png";
import NotLike from "../../img/notlike.png";
import Comment from "../../img/icon-comment.svg";
import ViewCmt from "../../img/icon-flatViewComment.svg";
import dots from "../../img/dots.png";
import defProfile from "../../img/icon-accounts.svg";
import CommentList from "./CommentList";
import BeatLoader from "react-spinners/BeatLoader";
import LikedUsersDetail from "../LikedUsersDetail/LikedUsersDetail";
import socket from "../../utils/socket";
import "./Post.scss";
import "./Modal.scss";

const Post = ({ data }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.authReducer.authData);

    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [showLikedUsers, setShowLikedUsers] = useState(false);
    const [likedUsers, setLikedUsers] = useState([]);
    const [showUnfollow, setshowUnfollow] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [showCmt, setshowCmt] = useState(false);
    const [liked, setLiked] = useState(data.likes.includes(user._id));
    const [likes, setLikes] = useState(data.likes.length);
    const [editData, setEditData] = useState({
        description: data.description,
    });
    const [reportData, setReportData] = useState("");
    const [text, setText] = useState("");
    const [isSaved, setIsSaved] = useState(user?.saved.includes(data._id));
    const [isFollowed, setIsFollowed] = useState(user?.following.includes(data?.user?._id));

    const handleComment = async () => {
        if (!text.trim()) return toast.error(<b>Comment cannot be empty!</b>);
        const newComment = {
            text,
            user: user._id,
            postId: data._id,
            postUserId: data.user._id,
        };

        try {
            const loadingToastId = toast.loading("Commenting...");
            let result = await dispatch(createComment(newComment));
            if (result.success) {
                toast.dismiss(loadingToastId);
                toast.success(<b>Comment added...!</b>);
                setText("");
            } else {
                toast.dismiss(loadingToastId);
                toast.error(<b>Failed to add comment...!</b>);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleViewComments = () => {
        setshowCmt(true);
    };

    const handleCmtClose = () => {
        setshowCmt(false);
    };
    const handleClose = () => setShow(false);
    const handleUfModalClose = () => setshowUnfollow(false);
    const handleUfModalShow = () => {
        setshowUnfollow(true);
        handleClose();
    };

    const handleReportClose = () => {
        setShowReport(false);
    };

    const handleEditClose = () => {
        setShowEdit(false);
        setEditData({ description: data.description });
    };

    const handleShow = () => setShow(true);
    const handleReportShow = () => {
        setShowReport(true);
        setShow(false);
    };
    const handleEditShow = () => {
        setShowEdit(true);
        setShow(false);
    };

    const handleLike = () => {
        if (!liked && user._id !== data?.user?._id) {
            const notification = {
                senderId: user._id,
                receiverId: data?.user?._id,
                text: "Liked your Post",
                url: data?.image,
            };
            createNotification(notification).then(({ data }) => {
                socket.emit("get-notification", {
                    to: notification.receiverId || data?.user?._id,
                    from: {
                        id: notification.senderId || user._id,
                        profileimage: user.profileimage,
                        username: user.username,
                    },
                    text: notification.text,
                    url: data?.image,
                });
            });
        }
        setLiked((prev) => !prev);
        liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
        dispatch(likePost(data._id, user._id));
    };

    const handleLikesView = async () => {
        try {
            setLoading(true);
            const response = await getLikedUsersDetail(data?._id);
            if (response.data) {
                setLikedUsers(response.data.likes);
                setLoading(false);
                setShowLikedUsers(true);
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error(<b>Couldn&#39;t get the details</b>);
        }
    };

    const maxEditLength = 100;
    const handleEditInput = (e) => {
        const inputValue = e.target.value;
        if (inputValue.length <= maxEditLength) {
            setEditData({
                ...editData,
                [e.target.name]: inputValue,
            });
        }
    };
    const maxReportLength = 100;
    const handleReportInput = (e) => {
        const inputValue = e.target.value;
        if (inputValue.length <= maxReportLength) {
            setReportData(inputValue);
        }
    };
    const handleReport = async () => {
        if (!reportData.trim()) return toast.error(<b>cannot send empty report!</b>);
        const loadingToastId = toast.loading("Reporting...");
        try {
            const reportPromise = await dispatch(createReport(user._id, "post", data._id, reportData));
            toast.dismiss(loadingToastId);
            if (reportPromise.success) {
                setShowReport(false);
                toast.success(<b>Post Reported...!</b>);
            } else {
                toast.error(<b>Post Report Failed...!</b>);
            }
        } catch (error) {
            toast.error(<b>Something went wrong while updating!</b>);
            console.error("Error:", error);
        }
    };

    const handleEdit = async () => {
        const { description } = editData;
        if (!description.trim()) {
            toast.error(<b>Description cannot be empty!</b>);
            return;
        }
        const loadingToastId = toast.loading("Updating...");
        try {
            const updatePromise = await dispatch(updatePost(data._id, user._id, editData));
            toast.dismiss(loadingToastId);
            if (updatePromise.success) {
                setShowEdit(false);
                toast.success(<b>Post Updated...!</b>);
            } else {
                toast.error(<b>Post Update Failed...!</b>);
            }
        } catch (error) {
            toast.error(<b>Something went wrong while updating!</b>);
            console.error("Error:", error);
        }
    };

    const handleDelete = async () => {
        const loadingToastId = toast.loading("Deleting...");
        try {
            const deletePromise = await dispatch(deletePost(data._id, user._id, "user"));
            toast.dismiss(loadingToastId);
            if (deletePromise.success) {
                toast.success(<b>Post Deleted...!</b>);
            } else {
                toast.error(<b>Failed to delete...!</b>);
            }
        } catch (error) {
            toast.error(<b>Something went wrong!</b>);
            console.error("Error:", error);
        }
    };

    const handleSave = async () => {
        const loadingToastId = toast.loading("Saving...");
        try {
            const savePromise = await dispatch(savePost(user._id, data._id, isSaved));
            toast.dismiss(loadingToastId);
            if (savePromise.success) {
                setIsSaved(!isSaved);
                toast.success(<b>{savePromise.message}</b>);
            } else {
                toast.error(<b>{savePromise.error}</b>);
            }
            handleClose();
        } catch (error) {
            handleClose();
            toast.error(<b>Something went wrong while saving!</b>);
            console.error("Error:", error);
        }
    };

    const handleFollow = async () => {
        const loadingToastId = toast.loading("Following...");
        try {
            const response = await dispatch(followUser(data.user._id, user._id));
            console.log(response);
            if (response.success) {
                // dispatch(getTimelinePosts(user._id));
                const notification = {
                    senderId: user._id,
                    receiverId: data?.user?._id,
                    text: "Started following you",
                };
                createNotification(notification).then(({ data }) => {
                    socket.emit("get-notification", {
                        to: notification.receiverId || data?.user?._id,
                        from: {
                            id: notification.senderId || user._id,
                            profileimage: user.profileimage,
                            username: user.username,
                        },
                        text: notification.text,
                    });
                });
                toast.success(<b>{response.message}</b>);
                setIsFollowed(!isFollowed);
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
        handleUfModalClose();
        try {
            const response = await dispatch(unfollowUser(data.user._id, user._id));
            console.log(response);
            if (response.success) {
                // dispatch(getTimelinePosts(user._id));
                toast.success(<b>{response.message}</b>);
                setIsFollowed(!isFollowed);
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
        //modal for post options
        <div className="Post">
            <Modal show={showUnfollow} onHide={handleUfModalClose}>
                <Modal.Body style={{ width: "10rem" }}>
                    <img src={data?.user?.profileimage || defProfile} alt="" />
                    <span className="lg-text pb-2">{isFollowed ? "Unfollow this user?" : "Follow this User?"}</span>
                    <div className="cover">
                        <button className="button modalButton" onClick={handleUfModalClose}>
                            No!
                        </button>
                        <button className="button modalButton" onClick={handleUnFollow}>
                            Yes!
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal show={show} onHide={handleClose} className="modal-postion">
                <Modal.Body>
                    {data.user?._id !== user._id && (
                        <>
                            <span onClick={isFollowed ? handleUfModalShow : handleFollow} className="linear-gradient-text">
                                {isFollowed ? "Unfollow User" : "Follow User"}
                            </span>
                            <hr />
                            <span onClick={handleReportShow} className="linear-gradient-text">
                                Report Post
                            </span>
                            <hr />
                        </>
                    )}
                    <span className="linear-gradient-text" onClick={handleSave}>
                        {isSaved ? "Unsave" : "Save"}
                    </span>

                    {data.user?._id === user._id && (
                        <>
                            <hr />
                            <button onClick={handleEditShow} className="linear-gradient-text">
                                Edit
                            </button>
                            <hr />
                            <span onClick={handleDelete} className="linear-gradient-text">
                                Delete
                            </span>
                        </>
                    )}
                </Modal.Body>
            </Modal>
            {/* modal for post edit/updation */}
            <Modal show={showEdit} onHide={handleEditClose} className="modal-postion">
                <Modal.Body style={{ width: "17rem" }}>
                    <label className="pt-2 pb-3 linear-gradient-text">Edit Description?</label>
                    <div className="Search">
                        <input type="text" name="description" value={editData.description} onChange={handleEditInput} />
                        <span onClick={handleEdit} className="material-symbols-outlined">
                            update
                        </span>
                    </div>
                    <div style={{ display: "flex" }}>
                        <span className="lg-text">
                            {maxEditLength - editData.description.length} / {maxEditLength}
                        </span>
                    </div>
                </Modal.Body>
            </Modal>

            {/* modal for post report */}
            <Modal show={showReport} onHide={handleReportClose} className="modal-postion">
                <Modal.Body style={{ width: "17rem" }}>
                    <label className="pt-2 pb-3 linear-gradient-text">Provide Reason!</label>
                    <div className="Search">
                        <textarea type="text" name="report" onChange={handleReportInput} />
                        <span onClick={handleReport} className="material-symbols-outlined">
                            report
                        </span>
                    </div>
                    <div style={{ display: "flex" }}>
                        <span className="lg-text">
                            {maxReportLength - reportData.length} / {maxReportLength}
                        </span>
                    </div>
                </Modal.Body>
            </Modal>

            <CommentList showCmt={showCmt} handleCmtClose={handleCmtClose} data={data} />
            {likedUsers.length !== 0 && (
                <LikedUsersDetail
                    currUser={user}
                    usersToShow={showLikedUsers}
                    userDetails={likedUsers}
                    setUsersToShow={setShowLikedUsers}
                />
            )}

            <div className="header">
                <div className="contents">
                    <button onClick={() => navigate(`/profile/${data.user._id}`)}>
                        <img className="image" src={data.user?.profileimage || defProfile} alt="profile" />
                        <span>{data.user?.username || "noNameAvailable"}</span>
                    </button>
                </div>
                <button onClick={handleShow}>
                    <img className="dot-image" src={dots} alt="" />
                </button>
            </div>
            <img src={data.image} alt="" />
            <div className="postReact">
                <img src={liked ? Heart : NotLike} alt="" style={{ cursor: "pointer" }} onClick={handleLike} />
                <img style={{ width: "1.8rem" }} src={ViewCmt} alt="comment" onClick={handleViewComments} />
            </div>
            <span
                onClick={handleLikesView}
                className="d-flex position-relative"
                style={{ color: "var(--gray)", fontSize: "12px", cursor: "pointer" }}
            >
                {likes} likes
                <BeatLoader loading={loading} color="orange" speedMultiplier={1} />
            </span>
            <div className="detail">
                <span>
                    <b>{data.user?.username || "noNameAvailable"}</b>
                </span>
                <span> {data.description}</span>
            </div>
            <div className="comment">
                <input type="text" placeholder="Add a comment..." value={text} onChange={(e) => setText(e.target.value)} />
                <img src={Comment} onClick={handleComment}></img>
            </div>
            {data.comments?.length !== 0 && (
                <span onClick={handleViewComments} className="lg-text viewCmt">
                    View all comments
                </span>
            )}
        </div>
    );
};

Post.propTypes = {
    data: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        likes: PropTypes.array.isRequired,
        comments: PropTypes.array.isRequired,
        user: PropTypes.shape({
            username: PropTypes.string,
            profileimage: PropTypes.string,
            _id: PropTypes.string.isRequired,
        }),
        description: PropTypes.string.isRequired,
    }).isRequired,
};

export default Post;
