import Modal from "react-bootstrap/Modal";
import toast, { Toaster } from "react-hot-toast";
import { createComment } from "../../redux/actions/CommentActions";
import CommentList from "../Post/CommentList";
import PropTypes from "prop-types";

import dots from "../../img/dots.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import NotLike from "../../img/notlike.png";
import Comment from "../../img/icon-comment.svg";
import defProfile from "../../img/icon-accounts.svg";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { deletePost, getAllPosts, getTimelinePosts, likePost, savePost, updatePost } from "../../redux/actions/PostAction";
import { createReport } from "../../redux/actions/ReportActions";
import { followUser, unfollowUser } from "../../redux/actions/UserAction";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
function ExplorePost({ postDtl, updateSavedPosts }) {
    const { user } = useSelector((state) => state.authReducer.authData);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showUnfollow, setshowUnfollow] = useState(false);
    const [showPost, setShowPost] = useState(false);
    const [liked, setLiked] = useState(postDtl?.likes.includes(user._id));
    const [isSaved, setIsSaved] = useState(user?.saved.includes(postDtl._id));
    const [likes, setLikes] = useState(postDtl?.likes.length);
    const [text, setText] = useState("");
    const [showCmt, setshowCmt] = useState(false);
    const [show, setShow] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editData, setEditData] = useState({
        description: postDtl.description,
    });
    const [reportData, setReportData] = useState("");
    const [isFollowed, setIsFollowed] = useState(user?.following.includes(postDtl.user._id));
    const handlePostClose = () => setShowPost(false);

    const handleClose = () => setShow(false);
    const handleUfModalClose = () => setshowUnfollow(false);
    const handleUfModalShow = () => {
        setshowUnfollow(true);
        handleClose();
    };

    const handleEditClose = () => {
        setShowEdit(false);
        setEditData({ description: postDtl.description });
    };

    const handleReportClose = () => {
        setShowReport(false);
    };

    const handleComment = async () => {
        if (!text.trim()) return toast.error(<b>Comment cannot be empty!</b>);
        const newComment = {
            text,
            user: user._id,
            postId: postDtl?._id,
            postUserId: postDtl?.user._id,
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

    const handleLike = () => {
        setLiked((prev) => !prev);
        liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
        dispatch(likePost(postDtl._id, user._id));
    };

    const handleDelete = async () => {
        const loadingToastId = toast.loading("Deleting...");
        try {
            const deletePromise = await dispatch(deletePost(postDtl._id, user._id));
            toast.dismiss(loadingToastId);
            if (deletePromise.success) {
                toast.success(<b>Post Deleted...!</b>);
                dispatch(getAllPosts(user._id));
            } else {
                toast.error(<b>Failed to delete...!</b>);
            }
        } catch (error) {
            toast.error(<b>Something went wrong!</b>);
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
            const updatePromise = await dispatch(updatePost(postDtl._id, user._id, editData));
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

    const handleReport = async () => {
        if (!reportData.trim()) return toast.error(<b>cannot send empty report!</b>);
        const loadingToastId = toast.loading("Reporting...");
        try {
            const reportPromise = await dispatch(createReport(user._id, "post", postDtl._id, reportData));
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

    const maxReportLength = 100;
    const handleReportInput = (e) => {
        const inputValue = e.target.value;
        if (inputValue.length <= maxReportLength) {
            setReportData(inputValue);
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

    const handleSave = async () => {
        const loadingToastId = toast.loading("Saving...");
        handleClose();
        try {
            const savePromise = await dispatch(savePost(user._id, postDtl._id, isSaved));
            toast.dismiss(loadingToastId);
            if (savePromise.success) {
                setIsSaved(!isSaved);
                toast.success(<b>{savePromise.message}</b>);
                if (savePromise.message == "Post unsaved successfully.") {
                    updateSavedPosts(postDtl._id);
                }
            } else {
                toast.error(<b>{savePromise.error}</b>);
            }
        } catch (error) {
            toast.error(<b>Something went wrong while saving!</b>);
            console.error("Error:", error);
        }
    };

    const handleFollow = async () => {
        const loadingToastId = toast.loading("Following...");
        handleClose();
        try {
            const response = await dispatch(followUser(postDtl.user._id, user._id));
            console.log(response);
            if (response.success) {
                dispatch(getTimelinePosts(user._id));
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
        handleClose();
        try {
            const response = await dispatch(unfollowUser(postDtl.user._id, user._id));
            if (response.success) {
                dispatch(getTimelinePosts(user._id));
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

    const handleViewComments = () => {
        setshowCmt(true);
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

    const handleCmtClose = () => {
        setshowCmt(false);
    };

    const handlePostView = () => {
        setShowPost(true);
    };
    return (
        <>
            <Toaster position="top-center" reverseOrder={false}></Toaster>

            <img onClick={() => handlePostView(postDtl)} src={postDtl.image} alt="" key={postDtl._id} />
            <Modal show={showUnfollow} onHide={handleUfModalClose}>
                <Modal.Body style={{ width: "10rem" }}>
                    <img src={postDtl.user.profileimage || defProfile} alt="" />
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
                    {postDtl.user?._id !== user._id && (
                        <>
                            <span onClick={isFollowed ? handleUfModalShow : handleFollow} className="linear-gradient-text">
                                {isFollowed ? "Unfollow" : "Follow"}
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

                    {postDtl.user?._id === user._id && (
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

            <Modal show={showPost} onHide={handlePostClose} style={{ marginTop: "3%" }}>
                <Modal.Body className="modal-bodywidth">
                    <div className="Posts">
                        <div className="Post lg-bg" style={{ textAlign: "left" }}>
                            <div className="header">
                                <div className="contents">
                                    <button onClick={() => navigate(`/profile/${postDtl?.user._id}`)}>
                                        <img
                                            className="image"
                                            src={postDtl?.user.profileimage || defProfile}
                                            alt="profile"
                                        />
                                        <span>{postDtl.user.username}</span>
                                    </button>
                                </div>
                                <button onClick={handleShow}>
                                    <img className="dot-image" src={dots} alt="" />
                                </button>
                            </div>
                            <img src={postDtl?.image} alt="" />
                            <div className="postReact">
                                <img
                                    src={liked ? Heart : NotLike}
                                    alt=""
                                    style={{ cursor: "pointer" }}
                                    onClick={handleLike}
                                />
                                <img src={Share} alt="" />
                            </div>
                            <span style={{ color: "var(--gray)", fontSize: "12px" }}>{likes} likes</span>
                            <div className="detail">
                                <span>
                                    <b>{postDtl?.user.username || "noNameAvailable"}</b>
                                </span>
                                <span> {postDtl?.description}</span>
                            </div>
                            <div className="comment">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                />
                                <img src={Comment} onClick={handleComment}></img>
                            </div>
                            {postDtl?.comments.length !== 0 && (
                                <span onClick={handleViewComments} className="lg-text viewCmt">
                                    View all comments
                                </span>
                            )}
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <CommentList showCmt={showCmt} handleCmtClose={handleCmtClose} data={postDtl} />
        </>
    );
}

ExplorePost.propTypes = {
    postDtl: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        comments: PropTypes.array.isRequired,
        likes: PropTypes.array.isRequired,
        user: PropTypes.shape({
            username: PropTypes.string.isRequired,
            profileimage: PropTypes.string.isRequired,
            _id: PropTypes.string.isRequired,
        }),
    }).isRequired,
    // updateSavedPosts: PropTypes.func.isRequired,
};

export default ExplorePost;
