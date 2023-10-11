import { useEffect } from "react";
import "./Explore.scss";
import { getAllPosts } from "../../redux/actions/PostAction";
import { useDispatch, useSelector } from "react-redux";
import PacmanLoader from "react-spinners/PacmanLoader";

import ExplorePost from "./ExplorePost";

function Explore() {
    let { allPosts, loading } = useSelector((state) => state.postReducer);
    const dispatch = useDispatch();

    const override = {
        display: "block",
        margin: "0 auto",
    };

    useEffect(() => {
        dispatch(getAllPosts());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <PacmanLoader loading={loading} cssOverride={override} color="orange" speedMultiplier={1} />

            {!loading && (
                <div className="Post">
                    <div className="explore">
                        {allPosts.map((post) => (
                            // <img onClick={() => handlePostView(post)} src={post.image} alt="" key={post._id} />
                            <ExplorePost postDtl={post} key={post._id} />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}

export default Explore;
