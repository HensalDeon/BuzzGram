import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSavedPosts } from "../../api/PostsRequests";
import { logout } from "../../redux/actions/AuthActions";
import PacmanLoader from "react-spinners/PacmanLoader";
import PostView from "../Explore/PostView";
import toast from "react-hot-toast";

function SavedPosts() {
    const { user } = useSelector((state) => state.authReducer.authData);
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    const updateSavedPosts = (postId) => {
        const updatedSavedPosts = savedPosts.filter((post) => post._id !== postId);
        setSavedPosts(updatedSavedPosts);
      };
      

    useEffect(() => {
        setLoading(true);
        getSavedPosts(user._id)
            .then((res) => {
                setLoading(false);
                setSavedPosts(res.data);
            })
            .catch((error) => {
                console.log(error);
                if (error.response.data.error === "Token has expired") {
                    dispatch(logout());
                }
                setLoading(false);
                toast.error(<b>Error loading saved Posts!</b>);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const override = {
        display: "block",
        margin: "20% auto",
    };
    return (
        <>
            <PacmanLoader loading={loading} cssOverride={override} color="orange" speedMultiplier={1} />
            {!loading && (
                <>
                    <div className="Post">
                        <b style={{ fontSize: "large" }} className="lg-text">
                            Saved Posts
                        </b>
                        <div className="explore">
                            {savedPosts?.map((post) => (
                                <PostView postDtl={post} key={post._id} updateSavedPosts={updateSavedPosts}/>
                            ))}
                            {savedPosts?.length < 1 && !loading && (
                                <b className="d-flex flex-row">
                                    You haven&#39;t saved any posts!{" "}
                                    <span className="material-symbols-outlined">photo_camera</span>
                                </b>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default SavedPosts;
