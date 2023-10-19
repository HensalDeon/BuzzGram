import { useNavigate } from "react-router-dom";
import avatar from "../../img/icon-accounts.svg";
import PropTypes from "prop-types";

function SerachResults({ users }) {
    const navigate = useNavigate();
    const handleUserView = (user) => {
        navigate(`/profile/${user._id}`);
    };
    return (
        <div className="FollowersCard" style={{ gap: "0rem" }}>
            {users.map((user) => {
                return (
                    <div onClick={() => handleUserView(user)} className="follower py-2 mx-2 px-2" key={user._id}>
                        <div>
                            <img
                                src={user.profileimage || avatar}
                                alt="avatar"
                                style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%" }}
                            />
                            <div className="name">
                                <span>{user?.fullname || "no name available"}</span>
                                <span>{user?.username || "no usernmae"}</span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
SerachResults.propTypes = {
    users: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string,
            fullname: PropTypes.string,
            username: PropTypes.string,
        })
    ).isRequired,
};
export default SerachResults;
