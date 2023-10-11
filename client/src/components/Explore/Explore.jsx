import { useEffect, useState } from "react";
import dots from "../../img/dots.png";
import Share from "../../img/share.png";
import Heart from "../../img/like.png";
import NotLike from "../../img/notlike.png";
import Comment from "../../img/icon-comment.svg";
import defProfile from "../../img/icon-accounts.svg";
import "./Explore.scss";
import { getAllPosts } from "../../redux/actions/PostAction";
import { useDispatch, useSelector } from "react-redux";
import PacmanLoader from "react-spinners/PacmanLoader";
import Modal from "react-bootstrap/Modal";

function Explore() {
    let { allPosts, loading } = useSelector((state) => state.postReducer);
    const { user } = useSelector((state) => state.authReducer.authData);
    const dispatch = useDispatch();
    const [postDtl, setPostDtl] = useState(null);
    const [showPost, setShowPost] = useState(false);
    const [liked, setLiked] = useState(postDtl?.likes.includes(user._id));
    const [likes, setLikes] = useState(postDtl?.likes.length);
    const handlePostClose = () => setShowPost(false);

    const override = {
        display: "block",
        margin: "0 auto",
    };
    const handlePostView = (post) => {
        setPostDtl(post);
        setShowPost(true);
        console.log("heyyyy", post);
    };
    useEffect(() => {
        dispatch(getAllPosts());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <Modal show={showPost} onHide={handlePostClose} style={{marginTop:"3%"}}>
                <Modal.Body className="modal-bodywidth">
                    <div className="Posts">
                        <div className="Post">
                            <div className="header">
                                <div className="contents">
                                    <button>
                                        <img className="image" src={postDtl?.user.profileimage || defProfile} alt="profile" />
                                        <span>testing</span>
                                    </button>
                                </div>
                                <button>
                                    <img className="dot-image" src={dots} alt="" />
                                </button>
                            </div>
                            <img src={postDtl?.image} alt="" />
                            <div className="postReact">
                                <img src={liked ? Heart : NotLike} alt="" style={{ cursor: "pointer" }} />
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
                                <img src={Comment}></img>
                            </div>
                            {postDtl?.comments?.length !== 0 && <span className="lg-text viewCmt">View all comments</span>}
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <PacmanLoader loading={loading} cssOverride={override} color="orange" speedMultiplier={1} />
            {!loading && (
                <div className="Post">
                    <div className="explore">
                        {allPosts.map((post) => (
                            <img onClick={() => handlePostView(post)} src={post.image} alt="" key={post._id} />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default Explore;
