import "./FollowersCard.scss";
import { Followers } from "../../Data/FollwersData";
import { useLocation } from "react-router-dom";

const FollowersCard = () => {
    const location = useLocation();
    return (
        <div className="FollowersCard" style={location.pathname.includes("/profile") ? { width: "40%",paddingRight:"2rem" } : {}}>
            <h3>People you may know!</h3>

            {Followers.map((follower) => {
                return (
                    <div className="follower" key={follower.id}>
                        <div>
                            <img src={follower.img} alt="" className="followerImage" />
                            <div className="name">
                                <span>{follower.name}</span>
                                <span>@{follower.username}</span>
                            </div>
                        </div>
                        <button className="button fc-button">Follow</button>
                    </div>
                );
            })}
        </div>
    );
};

export default FollowersCard;
