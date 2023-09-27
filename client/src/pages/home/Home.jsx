import PostSide from '../../components/PostSide/PostSide'
import { useEffect, useState } from 'react';
import ProfileSide from '../../components/profileSide/ProfileSide'
import './Home.scss'
import SideBar from '../../components/SideBar/SIdeBar';
const Home = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 930);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 930);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <div className="Home">
        <SideBar/>
        {isLargeScreen && <ProfileSide />}
        <PostSide/>
    </div>
  )
}

export default Home