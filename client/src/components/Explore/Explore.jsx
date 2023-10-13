import { useEffect } from "react";
import "./Explore.scss";
import { getAllPosts } from "../../redux/actions/PostAction";
import { useDispatch, useSelector } from "react-redux";
import PacmanLoader from "react-spinners/PacmanLoader";

import PostView from "./PostView";
import { useLocation } from "react-router-dom";

function Explore() {
    let { allPosts, loading } = useSelector((state) => state.postReducer);
    const { user } = useSelector((state) => state.authReducer.authData);
    const dispatch = useDispatch();
    const location = useLocation();

    const override = {
        display: "block",
        margin: "30% auto",
    };

    useEffect(() => {
        if (!allPosts?.length) {
            dispatch(getAllPosts(user._id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <PacmanLoader loading={loading} cssOverride={override} color="orange" speedMultiplier={1} />

            {!loading && (
                <div className="Post">
                    <b style={{ fontSize: "large" }} className="lg-text">
                        Explore Posts
                    </b>
                    <div
                        className="explore"
                        style={location.pathname.includes("/explore") ? { justifyContent: "space-between" } : {}}
                    >
                        {allPosts.map((post) => (
                            <PostView postDtl={post} key={post._id} />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default Explore;
