import "./Posts.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getTimelinePosts } from "../../redux/actions/PostAction";
import { motion } from "framer-motion";
import PropagateLoader from "react-spinners/PropagateLoader";
import Post from "../Post/Post";
import debounce from "lodash/debounce";

const Posts = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.authReducer.authData);
    let { posts, timeLineloading, moreTimelinePosts } = useSelector((state) => state.postReducer);
    const storedPage = localStorage.getItem("timelinePage");
    const initialPage = storedPage ? parseInt(storedPage, 10) : 1;
    const [page, setPage] = useState(initialPage);
    const [scrolling, setScrolling] = useState(false);

    const handelInfiniteScroll = async () => {
        if (!scrolling) {
            setScrolling(true);
            try {
                if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight) {
                    if (moreTimelinePosts) {
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
        const currentPage = localStorage.getItem("timelinePage");
        if (currentPage !== String(page)) {
            if (page) {
                dispatch(getTimelinePosts(user._id, page));
            }
            localStorage.setItem("timelinePage", page);
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
        <div className="Posts">
            {posts.map((post) => (
                <motion.div
                    key={post._id}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Post data={post} />
                </motion.div>
            ))}
            <PropagateLoader loading={timeLineloading} cssOverride={override} color="orange" />
        </div>
    );
};

export default Posts;
