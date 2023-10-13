import { useEffect, useState } from "react";
import "./InfoCard.scss";
import { UilPen } from "@iconscout/react-unicons";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as UserApi from "../../api/UserRequests.js";

const InfoCard = () => {
    const params = useParams();
    const profileUserId = params.id;
    const [profileUser, setProfileUser] = useState({});
    const { user } = useSelector((state) => state.authReducer.authData);

    useEffect(() => {
        const fetchProfileUser = async () => {
            if (profileUserId === user._id) {
                setProfileUser(user);
            } else {
                console.log("fetching");
                const profileUser = await UserApi.getUser(profileUserId);
                setProfileUser(profileUser);
                console.log(profileUser);
            }
        };
        fetchProfileUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <div className="InfoCard">
            <div className="infoHead">
                <h4>Profile Info</h4>
                {user._id === profileUserId ? (
                    <div>
                        <UilPen width="2rem" height="1.2rem" />
                    </div>
                ) : (
                    ""
                )}
            </div>

            <div className="info">
                <span>
                    <b>Fullname : </b>
                </span>
                <span>{profileUser.relationship}</span>
            </div>
            <div className="info">
                <span>
                    <b>Username : </b>
                </span>
                <span>{profileUser.relationship}</span>
            </div>
            <div className="info">
                <span>
                    <b>Bio :</b>
                </span>
                <span>{profileUser.worksAt}</span>
            </div>
        </div>
    );
};

export default InfoCard;
