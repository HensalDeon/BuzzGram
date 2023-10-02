import "./Post.scss";
import "../Modal/Modal.scss";

import { useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import Modal from "react-bootstrap/Modal";
import { likePost } from "../../api/PostsRequests";

import Comment from "../../img/comment.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import NotLike from "../../img/notlike.png";
import ProfileImage from "../../img/profileImg.jpg";
import dots from "../../img/dots.png";

const Post = ({ data }) => {
    console.log(data, "//////");
    const { user } = useSelector((state) => state.authReducer.authData);
    const [show, setShow] = useState(false);
    const [liked, setLiked] = useState(data.likes.includes(user._id));
    const [likes, setLikes] = useState(data.likes);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleLike = () => {
        likePost(data._id, user._id);
        setLiked((prev) => !prev);
        liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
    };

    const handleEdit = () => {
        console.log("heyyy");
    };
    return (
        <div className="Post">
            <Modal show={show} onHide={handleClose} className="background">
                <Modal.Body>
                    <button onClick={handleEdit} className="linear-gradient-text">
                        Edit
                    </button>
                    <hr />
                    <span className="linear-gradient-text">Follow User</span>
                    <hr />
                    <span className="linear-gradient-text">Save</span>
                    <hr />
                    <span className="linear-gradient-text">Report Post</span>
                    <hr />
                    <span className="linear-gradient-text">Delete</span>
                </Modal.Body>
            </Modal>

            <div className="header">
                <div className="contents">
                    <button>
                        <img className="image" src={data.userDetails?.profileimage || ProfileImage} alt="profile" />
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

            <span style={{ color: "var(--gray)", fontSize: "12px" }}>{likes.length} likes</span>

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
