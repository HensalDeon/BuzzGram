import "./Posts.scss";
import Post from "../Post/Post";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getTimelinePosts } from "../../redux/actions/PostAction";
// import { useParams } from "react-router-dom";

const Posts = () => {
    // const params = useParams();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.authReducer.authData);
    let { posts, loading } = useSelector((state) => state.postReducer);

    useEffect(() => {
        if (!posts.length) {
            dispatch(getTimelinePosts(user._id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (!posts) return "No Posts";
    // if (params.id) posts = posts.filter((post) => post.user === params.id);

    return (
        <div className="Posts">
            {loading
                ? "Fetching posts...."
                : posts.map((post) => {
                      return <Post data={post} key={post._id} />;
                  })}
        </div>
    );
};

export default Posts;
