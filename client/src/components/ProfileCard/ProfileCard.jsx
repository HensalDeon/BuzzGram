import { useSelector } from "react-redux";
import Cover from "../../img/cover.jpg";
import { Link } from "react-router-dom";
import defProfile from "../../img/icon-accounts.svg";
import "./ProfileCard.scss";
import { useState } from "react";
import PropTypes from "prop-types";

const ProfileCard = ({ location }) => {
    const { user } = useSelector((state) => state.authReducer.authData);
    const posts = useSelector((state) => state.postReducer.posts);
    const [expanded, setExpanded] = useState(false);

    const postCount = posts.filter((post) => post.userDetails?._id === user._id).length;
    console.log(postCount)

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    const bioClassName = `truncate-text ${expanded ? "show-full-text" : ""}`;
    return (
        <div className="ProfileCard">
            <div className="ProfileImages">
                <img src={user.coverimage || Cover} alt="cover image" />
                <img src={user.profileimage || defProfile} alt="profile image" />
            </div>

            <div className="ProfileName">
                <span>{user.username}</span>
                <span className={bioClassName} onClick={toggleExpand}>
                    {user.bio || "Write about yourself😊"}
                </span>
            </div>

            <div className="followStatus">
                <hr />
                <div>
                    <div className="follow">
                        <span>{user.followers.length}</span>
                        <span>Followers</span>
                    </div>
                    <div className="vl"></div>
                    <div className="follow">
                        <span>{user.following.length}</span>
                        <span>Followings</span>
                    </div>

                    {user && (
                        <>
                            <div className="vl"></div>
                            <div className="follow">
                                <span>{postCount}</span>
                                <span>Posts</span>
                            </div>
                        </>
                    )}
                </div>
                <hr />
            </div>
            {location === "profile" ? (
                ""
            ) : (
                <span>
                    <Link to={`/profile/${user._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                        My Profile
                    </Link>
                </span>
            )}
        </div>
    );
};

ProfileCard.propTypes = {
    location: PropTypes.string.isRequired,
};

export default ProfileCard;
