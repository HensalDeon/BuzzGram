import Modal from "react-bootstrap/Modal";
import toast from "react-hot-toast";
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
import { likePost } from "../../redux/actions/PostAction";

function ExplorePost({ postDtl }) {
    const { user } = useSelector((state) => state.authReducer.authData);
    const dispatch = useDispatch();
    const [showPost, setShowPost] = useState(false);
    const [liked, setLiked] = useState(postDtl?.likes.includes(user._id));
    const [likes, setLikes] = useState(postDtl?.likes.length);
    const [text, setText] = useState("");
    const [showCmt, setshowCmt] = useState(false);

    const handlePostClose = () => setShowPost(false);

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

    const handleViewComments = () => {
        setshowCmt(true);
    };

    const handleCmtClose = () => {
        setshowCmt(false);
    };

    const handlePostView = (post) => {
        setShowPost(true);
        console.log("heyyyy", post);
    };
    return (
        <>
            <img onClick={() => handlePostView(postDtl)} src={postDtl.image} alt="" key={postDtl._id} />
            <Modal show={showPost} onHide={handlePostClose} style={{ marginTop: "3%" }}>
                <Modal.Body className="modal-bodywidth">
                    <div className="Posts">
                        <div className="Post lg-bg" style={{ textAlign: "left" }}>
                            <div className="header">
                                <div className="contents">
                                    <button>
                                        <img
                                            className="image"
                                            src={postDtl?.user.profileimage || defProfile}
                                            alt="profile"
                                        />
                                        <span>testing</span>
                                    </button>
                                </div>
                                <button>
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
                                <input type="text" placeholder="Add a comment..." />
                                <img src={Comment} onClick={handleComment}></img>
                            </div>
                            {postDtl?.comments?.length !== 0 && (
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
};

export default ExplorePost;
