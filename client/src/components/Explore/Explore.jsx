import { useEffect, useState } from "react";
import { getAllPosts } from "../../redux/actions/PostAction";
import { useDispatch, useSelector } from "react-redux";
import PropagateLoader from "react-spinners/PropagateLoader";
import PostView from "./PostView";
import debounce from "lodash/debounce";
import "./Explore.scss";

function Explore() {
    const { allPosts, loading, hasMorePosts } = useSelector((state) => state.postReducer);
    const { user } = useSelector((state) => state.authReducer.authData);
    const dispatch = useDispatch();
    const storedPage = localStorage.getItem("expPage");
    const initialPage = storedPage ? parseInt(storedPage, 10) : 1;
    const [page, setPage] = useState(initialPage);
    const [scrolling, setScrolling] = useState(false);

    const handelInfiniteScroll = async () => {
        if (!scrolling) {
            setScrolling(true);
            try {
                if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
                    if (hasMorePosts) {
                        setPage((prev) => prev + 1);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const debouncedInfiniteScroll = debounce(handelInfiniteScroll, 1000);

    const override = {
        display: "block",
        margin: "auto",
    };

    useEffect(() => {
        const currentPage = localStorage.getItem("expPage");
        if (currentPage !== String(page)) {
            dispatch(getAllPosts(user._id, page));
            localStorage.setItem("expPage", page);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, dispatch, user._id]);

    useEffect(() => {
        window.addEventListener("scroll", debouncedInfiniteScroll);
        return () => {
            window.removeEventListener("scroll", debouncedInfiniteScroll);
            setScrolling(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scrolling]);

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
                <PropagateLoader loading={loading} cssOverride={override} color="orange" />
            </div>
        </>
    );
}

export default Explore;
