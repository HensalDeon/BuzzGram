import { useEffect, useState } from "react";
import "./Explore.scss";
import { getAllPosts } from "../../redux/actions/PostAction";
import { useDispatch, useSelector } from "react-redux";
import PropagateLoader from "react-spinners/PropagateLoader";
import PostView from "./PostView";
import loadingImg from "../../img/icon-flatLoadMore.svg";
import noMore from "../../img/icon-flatNoMore.svg";

function Explore() {
    const { allPosts, loading, hasMorePosts } = useSelector((state) => state.postReducer);
    const { user } = useSelector((state) => state.authReducer.authData);
    const dispatch = useDispatch();
    const storedPage = localStorage.getItem("expPage");
    const initialPage = storedPage ? parseInt(storedPage, 10) : 1;
    const [page, setPage] = useState(initialPage);

    const override = {
        display: "block",
        margin: "auto",
    };

    const handleLoadMore = () => {
        if (hasMorePosts) {
            setPage((prev) => prev + 1);
        }
    };

    useEffect(() => {
        const currentPage = localStorage.getItem("expPage");
        if (currentPage !== String(page)) {
            dispatch(getAllPosts(user._id, page));
            localStorage.setItem("expPage", page);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, dispatch, user._id]);

    return (
        <>
            <div className="Post">
                <b style={{ fontSize: "large" }} className="lg-text">
                    Explore Posts
                </b>
                <div className="explore">
                    {allPosts.map((post) => (
                        <PostView postDtl={post} key={post._id} />
                    ))}
                </div>
                <div
                    className="d-flex justify-content-center"
                    style={{ cursor: "pointer" }}
                    onClick={hasMorePosts ? handleLoadMore : null}
                >
                    {!loading && (
                        <b className="lg-text">
                            {hasMorePosts ? "Load More" : "Nothing to show more!"}
                            <img
                                style={{ width: "1.5rem", paddingLeft: "3px" }}
                                src={hasMorePosts ? loadingImg : noMore}
                                alt="load"
                            />
                        </b>
                    )}
                </div>
                <PropagateLoader loading={loading} cssOverride={override} color="orange" />
            </div>
        </>
    );
}

export default Explore;
