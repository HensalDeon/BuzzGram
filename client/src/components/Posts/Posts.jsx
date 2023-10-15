import "./Posts.scss";
import Post from "../Post/Post";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getTimelinePosts } from "../../redux/actions/PostAction";
import PacmanLoader from "react-spinners/PacmanLoader";

const Posts = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.authReducer.authData);
    let { posts, timeLineloading } = useSelector((state) => state.postReducer);

    const override = {
        display: "block",
        margin: "0 auto",
    };

    useEffect(() => {
        if (!posts.length) {
            dispatch(getTimelinePosts(user._id));
            //get the reports also here
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (!posts) return "No Posts";

    return (
        <div className="Posts">
            <PacmanLoader loading={timeLineloading} cssOverride={override} color="orange" speedMultiplier={1} />
            {!timeLineloading &&
                posts.map((post) => {
                    return <Post data={post} key={post._id} />;
                })}
        </div>
    );
};

export default Posts;
