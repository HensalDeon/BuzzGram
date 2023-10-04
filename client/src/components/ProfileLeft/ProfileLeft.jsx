import { useEffect } from "react";
import FollowersCard from "../FollowersCard/FollowersCard";
import InfoCard from "../InfoCard/InfoCard";
import LogoSearch from "../LogoSearch/LogoSearch";
import "../profileSide/ProfileSide.scss"
const ProfileLeft = () => {
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
            <InfoCard />
            <FollowersCard />
        </div>
    );
};

export default ProfileLeft;
