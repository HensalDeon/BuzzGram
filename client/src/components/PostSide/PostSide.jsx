import LogoSearch from "../LogoSearch/LogoSearch";
import Posts from "../Posts/Posts";
import PostShare from "../PostShare/PostShare";
import "./PostSide.scss";

const PostSide = () => {
    return (
        <div className="PostSide">
            {window.innerWidth < 930 && <LogoSearch />}
            <PostShare />
            <Posts />
        </div>
    );
};

export default PostSide;
