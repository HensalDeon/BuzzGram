import PostSide from "../../components/PostSide/PostSide";
import { useEffect, useState } from "react";
import ProfileSide from "../../components/profileSide/ProfileSide";
import "./Home.scss";
import SideBar from "../../components/SideBar/SideBar";
import BottomBar from "../../components/BottomBar/BottomBar";
import PropTypes from "prop-types";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import Explore from "../../components/Explore/Explore";
import SavedPosts from "../../components/SavedPosts/SavedPosts";
import FollowersCard from "../../components/FollowersCard/FollowersCard";

const Home = ({ location }) => {
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 930);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 450);

    useEffect(() => {
        const handleResize = () => {
            setIsLargeScreen(window.innerWidth >= 930);
            setIsSmallScreen(window.innerWidth <= 450);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="Home">
            {isSmallScreen ? <BottomBar /> : <SideBar />}
            {isLargeScreen && location == "home" && <ProfileSide location={location} />}
            {location === "home" && <PostSide />}
            {location === "explore" && <Explore />}
            {location === "saved" && <SavedPosts />}
            {/* {location === "profile" && <ProfileCard location={location} />} */}
            {location === "profile" && (
                <div className="d-flex flex-row">
                    <ProfileCard location={location} />
                    {isLargeScreen && <FollowersCard />}
                </div>
            )}
        </div>
    );
};

Home.propTypes = {
    location: PropTypes.string.isRequired,
};

export default Home;
