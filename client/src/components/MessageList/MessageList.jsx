import "./MessageList.scss";
import Profile from "../../img/profileImg.jpg";
import { Followers } from "../../Data/FollowersData";

function Notifications() {
  return (
    <div className="notification">
      <div className="search-bar">
        <input type="text" name="input" placeholder="Search users..." />
      </div>
      <div className="notification-list">
        {Followers.map((follower) => (
          <div className="notification-item" key={follower.id}>
            <img src={Profile} alt="" />
            <span>
              <>{follower.name}</>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notifications;
