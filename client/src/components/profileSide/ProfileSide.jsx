import { useEffect } from "react";
import FollowersCard from "../FollowersCard/FollowersCard";
import LogoSearch from "../LogoSearch/LogoSearch";
import ProfileCard from "../ProfileCard/ProfileCard";
import PropTypes from "prop-types";

import "./ProfileSide.scss";
const ProfileSide = ({ location }) => {

    useEffect(() => {
        const ProfileSide = document.querySelector(".ProfileSide");
        ProfileSide.classList.add("initial");
        setTimeout(() => {
            ProfileSide.classList.remove("initial");
        }, 100);
    }, []);
    return (
        <div className="ProfileSide" style={{ animationDelay: "0.5s" }}>
            <LogoSearch />
            <ProfileCard location={location}/>
            <FollowersCard />
        </div>
    );
};

ProfileSide.propTypes = {
    location: PropTypes.string.isRequired,
};

export default ProfileSide;
