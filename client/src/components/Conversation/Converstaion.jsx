import { useState } from "react";
import { useEffect } from "react";
import { getUser } from "../../api/UserRequests";
import avatar from "../../img/icon-accounts.svg";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/actions/AuthActions";
import img from "../../img/icon-flatImageChat.svg"
function Converstaion({ data, currentUser, online }) {
    const [userData, setUserData] = useState(null);
    const dispatch = useDispatch();
    useEffect(() => {
        const userId = data.members.find((id) => id !== currentUser);
        const getUserData = async () => {
            try {
                const { data } = await getUser(userId);
                setUserData(data);
            } catch (error) {
                console.log(error, "//");
                if (error.response.data.error === "Token has expired") {
                    dispatch(logout());
                }
            }
        };
        getUserData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <div className="conversation">
                <div className="follower">
                    {online && <div className="online-dot"></div>}
                    {!online && (
                        <>
                            <div className="online-dot"></div>
                            <div className="offline-dot"></div>
                        </>
                    )}
                    <img
                        src={userData?.profileimage || avatar}
                        alt="Profile"
                        className="followerImage"
                        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                    />
                    <div className="name" style={{ fontSize: "0.8rem" }}>
                        <span>{userData?.username}</span>
                        <span style={{ color: online ? "#51e200" : "darkgrey" }}>{online ? "Online" : "Offline"}</span>
                        <span className="trunc-text lg-text">{data?.lastMessage?.media ? <span><img style={{width:"1rem"}} src={img} alt="" /> Image</span> : data?.lastMessage?.text}</span>
                    </div>
                </div>
            </div>
            <div className="divider" />
        </>
    );
}

Converstaion.propTypes = {
    data: PropTypes.object.isRequired,
    currentUser: PropTypes.string.isRequired,
    online: PropTypes.bool.isRequired,
};

export default Converstaion;
