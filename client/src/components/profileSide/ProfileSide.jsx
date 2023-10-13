import { useEffect } from "react";
import FollowersCard from "../FollowersCard/FollowersCard";
import LogoSearch from "../LogoSearch/LogoSearch";
import ProfileCard from "../ProfileCard/ProfileCard";
import PropTypes from "prop-types";

import "./ProfileSide.scss";
import InfoCard from "../InfoCard/InfoCard";
import { useSelector } from "react-redux";
const ProfileSide = ({ location }) => {
    const { user } = useSelector((state) => state.authReducer.authData);
    const posts = useSelector((state) => state.postReducer.posts);

    useEffect(() => {
        const ProfileSide = document.querySelector(".ProfileSide");
        ProfileSide.classList.add("initial");
        setTimeout(() => {
            ProfileSide.classList.remove("initial");
        }, 100);
    }, []);
    return (
        <div className="ProfileSide" style={{ animationDelay: "0.5s" }}>
            {/* <Notifications/> */}
            <LogoSearch />
            {location === "profile" ? <InfoCard /> : <ProfileCard location={location} user={user} posts={posts} />}
            <FollowersCard />
        </div>
    );
};

ProfileSide.propTypes = {
    location: PropTypes.string.isRequired,
};

export default ProfileSide;
