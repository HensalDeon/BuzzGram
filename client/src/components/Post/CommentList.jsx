import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getComments, likeComment } from "../../api/CommentRequests";
import avatar from "../../img/icon-accounts.svg";
import like from "../../img/like.png";
import unLike from "../../img/notlike.png";
import PacmanLoader from "react-spinners/PacmanLoader";
import { useSelector } from "react-redux";

const CommentList = ({ showCmt, handleCmtClose, id }) => {
    const { user } = useSelector((state) => state.authReducer.authData);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);

    const override = {
        position: "absolute",
        top: "49%",
        left: "40%",
        display: "block",
        margin: "0 auto",
        zIndex: "100",
    };

    const handleCmtLike = async (commentId) => {
        const updatedcmt = comments.map((comment) => {
            if (comment._id === commentId) {
                const updatedLikes = comment.likes.includes(user._id)
                    ? comment.likes.filter((userId) => userId !== user._id)
                    : [...comment.likes, user._id];
                return { ...comment, likes: updatedLikes };
            }
            return comment;
        });

        setComments(updatedcmt);
        likeComment(commentId, user._id);
    };

    useEffect(() => {
        if (showCmt) {
            setLoading(true);
            getComments(id)
                .then((response) => {
                    if (response.data) {
                        setLoading(false);
                        setComments(response.data);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching comments:", error);
                });
        }
    }, [showCmt, id]);

    return (
        <>
            <PacmanLoader loading={loading} cssOverride={override} color="orange" speedMultiplier={1} />
            {!loading && (
                <Modal show={showCmt} onHide={handleCmtClose}>
                    <Modal.Body style={{ paddingBottom: "18px" }}>
                        {comments.map((comment, index) => (
                            <div key={comment._id}>
                                <div className="cmt-containers">
                                    <img src={avatar} style={{ maxWidth: "2rem" }} alt="avatar" />
                                    <div className="user-details">
                                        <b className="lg-text">{comment.user.username}</b>
                                        <span className="text">{comment.text}</span>
                                    </div>
                                    <div className="like-count">
                                        {/* <img src={unLike} onClick={()=> handleCmtLike(comment._id)} alt="like" /> */}
                                        <img
                                            src={comment.likes.includes(user._id) ? like : unLike}
                                            onClick={() => handleCmtLike(comment._id)}
                                            alt="like"
                                        />
                                        <span className="lg-text" style={{ fontSize: "13px" }}>
                                            {comment.likes.length}
                                        </span>
                                    </div>
                                </div>
                                {index < comments.length - 1 ? <hr /> : null}
                            </div>
                        ))}
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};

CommentList.propTypes = {
    showCmt: PropTypes.bool.isRequired,
    handleCmtClose: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
};

export default CommentList;
