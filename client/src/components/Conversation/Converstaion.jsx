// import { useState } from "react";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { getUser } from "../../api/UserRequests";
// import avatar from "../../img/icon-accounts.svg";
// function Converstaion({ data, currentUser, online }) {
//     const [userData, setUserData] = useState(null);
//     const dispatch = useDispatch();

//     useEffect(() => {
//         const userId = data.members.find((id) => id !== currentUser);
//         const getUserData = async () => {
//             try {
//                 const { data } = await getUser(userId);
//                 console.log(data,'123');
//                 setUserData(data);
//                 dispatch({ type: "SAVE_USER", data: data });
//             } catch (error) {
//                 console.log(error);
//             }
//         };

//         getUserData();
//     }, []);
//     return (
//         <>
//             <div className="conversation">
//                 <div className="follower">
//                     {online && <div className="online-dot"></div>}
//                     <img src={userData?.profileimage || avatar} alt="Profile" className="followerImage" style={{ width: "50px", height: "50px", borderRadius:"50%" }} />
//                     <div className="name" style={{ fontSize: "0.8rem" }}>
//                         <span>{userData?.username }</span>
//                         <span style={{ color: online ? "#51e200" : "" }}>{online ? "Online" : "Offline"}</span>
//                     </div>
//                 </div>
//             </div>
//             <hr style={{ width: "85%", border: "0.1px solid #ECEFF0" }} />
//         </>
//     );
// }

// export default Converstaion;

import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUser } from "../../api/UserRequests";
import avatar from "../../img/icon-accounts.svg";
function Converstaion({ data, currentUser, online }) {
    const [userData, setUserData] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const userId = data.members.find((id) => id !== currentUser);
        const getUserData = async () => {
            try {
                const { data } = await getUser(userId);
                console.log(data,'123');
                setUserData(data);
                // dispatch({ type: "SAVE_USER", data: data });
            } catch (error) {
                console.log(error);
            }
        };

        getUserData();
    }, []);
    return (
        <>
            <div className="conversation">
                <div className="follower">
                    {online && <div className="online-dot"></div>}
                    <img src={userData?.profileimage || avatar} alt="Profile" className="followerImage" style={{ width: "50px", height: "50px", borderRadius:"50%" }} />
                    <div className="name" style={{ fontSize: "0.8rem" }}>
                        <span>{userData?.username }</span>
                        <span style={{ color: online ? "#51e200" : "" }}>{online ? "Online" : "Offline"}</span>
                    </div>
                </div>
            </div>
            <div className="divider" />
        </>
    );
}

export default Converstaion;
