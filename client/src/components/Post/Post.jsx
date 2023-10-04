import "./Post.scss";
import "./Modal.scss";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import { deletePost } from "../../api/PostsRequests";
import toast, { Toaster } from "react-hot-toast";

import Comment from "../../img/comment.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import NotLike from "../../img/notlike.png";
import dots from "../../img/dots.png";
import defProfile from "../../img/icon-accounts.svg";
import { getTimelinePosts, likePost } from "../../redux/actions/PostAction";

const Post = ({ data }) => {
    // console.log(data, "//////");
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.authReducer.authData);
    const [show, setShow] = useState(false);
    const [liked, setLiked] = useState(data.likes.includes(user._id));
    const [likes, setLikes] = useState(data.likes.length);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleLike = () => {
        setLiked((prev) => !prev);
        liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
        dispatch(likePost(data._id, user._id));
    };
    

    const handleEdit = () => {
        console.log("edit");
    };
    const handleDelete = async () => {
        const loadingToastId = toast.loading("Deleting...");
        try {
            const deletePromise = await deletePost(data._id, user._id);
            toast.dismiss(loadingToastId);
            if (deletePromise.status === 200) {
                toast.success(<b>{deletePromise.data}</b>);
                dispatch(getTimelinePosts(user._id));
            } else {
                toast.error(<b>{deletePromise.data}</b>);
            }
            console.log("delre");
        } catch (error) {
            toast.error(<b>Something went wrong!</b>);
            console.error("Error:", error);
        }
    };
    const handleSave = () => {
        console.log("save");
    };

    return (
        <div className="Post">
            <Modal show={show} onHide={handleClose} className="background">
                <Modal.Body>
                    {data.userDetails?._id !== user._id && (
                        <>
                            <span className="linear-gradient-text">Follow User</span>
                            <hr />
                            <span className="linear-gradient-text">Report Post</span>
                            <hr />
                        </>
                    )}
                    <span className="linear-gradient-text" onClick={handleSave}>
                        Save
                    </span>

                    {data.userDetails?._id === user._id && (
                        <>
                            <hr />
                            <button onClick={handleEdit} className="linear-gradient-text">
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

            <div className="header">
                <div className="contents">
                    <button>
                        <img className="image" src={data.userDetails?.profileimage || defProfile} alt="profile" />
                        <span>{data.userDetails?.username || "noNameAvailable"}</span>
                    </button>
                </div>
                <button onClick={handleShow}>
                    <img className="dot-image" src={dots} alt="" />
                </button>
            </div>
            <img src={data.image} alt="" />
            <div className="postReact">
                <img src={liked ? Heart : NotLike} alt="" style={{ cursor: "pointer" }} onClick={handleLike} />
                <img src={Comment} alt="" />
                <img src={Share} alt="" />
            </div>

            <span style={{ color: "var(--gray)", fontSize: "12px" }}>{likes} likes</span>

            <div className="detail">
                <span>
                    <b>{data.userDetails?.username || "noNameAvailable"}</b>
                </span>
                <span> {data.description}</span>
            </div>
        </div>
    );
};

Post.propTypes = {
    data: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        likes: PropTypes.array.isRequired,
        userDetails: PropTypes.shape({
            username: PropTypes.string,
            profileimage: PropTypes.string,
            _id: PropTypes.string.isRequired,
        }),
        description: PropTypes.string.isRequired,
    }).isRequired,
};
export default Post;
