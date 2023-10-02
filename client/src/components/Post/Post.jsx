import "./Post.scss";
import "../Modal/Modal.scss";
import Comment from "../../img/comment.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import NotLike from "../../img/notlike.png";
import ProfileImage from "../../img/profileImg.jpg";
import dots from "../../img/dots.png";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";


const Post = ({ data }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // console.log(data,'//////',data.image)
    return (
        //Modal for post management
        <div className="Post">
            <Modal show={show} onHide={handleClose} className="background">
                {/* <Modal.Header closeButton>
                    <Modal.Title className="title">Modal heading</Modal.Title>
                </Modal.Header> */}
                <Modal.Body>
                    <span className="linear-gradient-text">Report Post</span>
                    <hr />
                    <span className="linear-gradient-text">Save</span>
                    <hr />
                    <span className="linear-gradient-text">Follow User</span>
                    <hr />
                    <span className="linear-gradient-text">Delete</span>
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer> */}
            </Modal>

            <div className="header">
                <div className="contents">
                    <button>
                        <img className="image" src={ProfileImage} alt="profile" />
                        <span>Zendaya</span>
                    </button>
                </div>
                <button onClick={handleShow}>
                    <img className="dot-image" src={dots} alt="" />
                </button>
            </div>
            <img src={data.image} alt="" />
            <div className="postReact">
                <img src={data.liked ? Heart : NotLike} alt="" />
                <img src={Comment} alt="" />
                <img src={Share} alt="" />
            </div>

            <span style={{ color: "var(--gray)", fontSize: "12px" }}>{data.likes} likes</span>
            <div></div>

            <div className="detail">
                <span>
                    <b>{data.name}</b>
                </span>
                <span> {data.description}</span>
            </div>
        </div>
    );
};

export default Post;
