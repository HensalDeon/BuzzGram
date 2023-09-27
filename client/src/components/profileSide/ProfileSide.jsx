import { useEffect } from 'react'
import FollowersCard from '../FollowersCard/FollowersCard'
import LogoSearch from '../LogoSearch/LogoSearch'
import ProfileCard from '../ProfileCard/ProfileCard'

import "./ProfileSide.scss"
import Notifications from '../MessageList/MessageList'
const ProfileSide = () => {
  useEffect(() => {
    const ProfileSide = document.querySelector(".ProfileSide");
    ProfileSide.classList.add("initial");
    setTimeout(() => {
      ProfileSide.classList.remove("initial");
    }, 100);
  }, []);
  return (
    <div className="ProfileSide" style={{animationDelay:"0.5s"}}>
        {/* <Notifications/> */}
        <LogoSearch/>
        <ProfileCard/>
        <FollowersCard/>
    </div>
  )
}

export default ProfileSide