import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getComments, likeComment, updateComment } from "../../api/CommentRequests";
import avatar from "../../img/icon-accounts.svg";
import dots from "../../img/icon-threeDots.svg";
import like from "../../img/like.png";
import unLike from "../../img/notlike.png";
import PacmanLoader from "react-spinners/PacmanLoader";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { logout } from "../../redux/actions/AuthActions";

const CommentList = ({ showCmt, handleCmtClose, data }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.authReducer.authData);
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCmtEdit, setshowCmtEdit] = useState(false);
    const [showAction, setShowAction] = useState(false);
    const [selectedComment, setSelectedComment] = useState(null);
    const [editCmt, setEditCmt] = useState("");

    const handleActionClose = () => {
        setShowAction(false);
    };

    const handleCmtEditClose = () => {
        setshowCmtEdit(false);
    };

    const handleActionShow = (cmtData) => {
        setEditCmt(cmtData.text);
        setSelectedComment(cmtData.user._id);
        setComment(cmtData);
        setShowAction(true);
    };

    const handleCmtEditShow = () => {
        setshowCmtEdit(true);
        setShowAction(false);
    };

    const handleCmtEditInput = (e) => {
        const inputValue = e.target.value;
        setEditCmt(inputValue);
    };

    const handleCmtEdit = () => {
        const loadingToastId = toast.loading("Commenting...");
        updateComment(comment._id, editCmt).then((res) => {
            toast.dismiss(loadingToastId);
            toast.success(<b>{res.data.msg}</b>);
            handleActionClose();
            handleCmtEditClose();

            const updatedComments = comments.map((cmt) => {
                if (cmt._id === comment._id) {
                    return { ...cmt, text: editCmt };
                }
                return cmt;
            });
            setComments(updatedComments);
        });
    };

    const handleCmtDelete = () => {
        // const loadingToastId = toast.loading("Deleting...");
        // deleteComment()
        console.log(data._id, "///", comment);
    };

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
        likeComment(commentId, user._id).catch((error) => {
            console.log(error);
            if (error.response.status === 401) {
                dispatch(logout());
            }
        });
    };

    useEffect(() => {
        if (showCmt) {
            setLoading(true);
            getComments(data._id)
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
    }, [showCmt, data._id]);

    return (
        <>
            <PacmanLoader loading={loading} cssOverride={override} color="orange" speedMultiplier={1} />
            <Modal show={showAction} onHide={handleActionClose} className="modal-postion">
                <Modal.Body style={{ background: "#232323" }}>
                    {selectedComment !== user._id ? (
                        <>
                            <span className="linear-gradient-text">Report</span>
                        </>
                    ) : (
                        <>
                            <span onClick={handleCmtEditShow} className="linear-gradient-text">
                                Edit
                            </span>
                            <hr />
                            <span onClick={handleCmtDelete} className="linear-gradient-text">
                                Delete
                            </span>
                        </>
                    )}
                </Modal.Body>
            </Modal>
            {/* modal for post edit comment */}
            <Modal show={showCmtEdit} onHide={handleCmtEditClose} className="modal-postion">
                <Modal.Body style={{ width: "17rem", background: "#232323" }}>
                    <label className="pt-2 pb-3 linear-gradient-text">Edit Comment?</label>
                    <div className="Search">
                        <input type="text" name="description" value={editCmt} onChange={handleCmtEditInput} />
                        <span onClick={handleCmtEdit} className="material-symbols-outlined">
                            update
                        </span>
                    </div>
                </Modal.Body>
            </Modal>
            {!loading && (
                <Modal show={showCmt} onHide={handleCmtClose}>
                    <Modal.Body style={{ paddingBottom: "18px", maxHeight: "15rem", overflowY: "auto" }}>
                        {comments.map((comment, index) => (
                            <div key={comment._id}>
                                <div className="cmt-containers">
                                    <img src={avatar} style={{ maxWidth: "2rem" }} alt="avatar" />
                                    <div className="user-details">
                                        <b className="lg-text">{comment.user.username}</b>
                                        <span className="text">
                                            {comment.text}&nbsp;&nbsp;&nbsp;&nbsp;
                                            <img
                                                onClick={() => handleActionShow(comment)}
                                                className="dots"
                                                style={{ width: "1.5rem" }}
                                                src={dots}
                                                alt="dots"
                                            ></img>
                                        </span>
                                    </div>
                                    <div className="like-count">
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
    data: PropTypes.shape({
        _id: PropTypes.string.isRequired,
    }).isRequired,
};

export default CommentList;
