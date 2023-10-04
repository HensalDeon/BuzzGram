import { useEffect, useState } from "react";
import PostSide from "../../components/PostSide/PostSide";
import ProfileCard from "../../components/ProfileCard/ProfileCard";
import ProfileLeft from "../../components/ProfileLeft/ProfileLeft";
import "./Profile.scss";
import BottomBar from "../../components/BottomBar/BottomBar";
import SideBar from "../../components/SideBar/SideBar";
const Profile = () => {
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
    }, []);
    return (
        <div className="Profile">
          {isSmallScreen ? <BottomBar/>:<SideBar />}
          {isLargeScreen && <ProfileLeft />}
            <div className="Profile-center">
                <ProfileCard location="profilePage" />
                <PostSide />
            </div>
        </div>
    );
};

export default Profile;
