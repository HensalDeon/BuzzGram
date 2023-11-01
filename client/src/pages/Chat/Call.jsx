import { useDispatch, useSelector } from "react-redux";
import cancelIcon from "../../img/icon-flatCancel.svg";
import { motion } from "framer-motion";
import PulseLoader from "react-spinners/PulseLoader";
import { useState } from "react";
function Call({ data, socket }) {
    console.log(data);
    const dispatch = useDispatch();
    const { videoCall, voiceCall } = useSelector((state) => state.chatReducer);

    const endCall = () => {
        if (data.callType === "voice") {
            socket.current.emit("reject-voice-call", { from: data._id });
        } else {
            socket.current.emit("reject-video-call", { from: data._id });
        }
        dispatch({ type: "END_CALL" });
    };

    return (
        <div className="image-modal">
            <div className="d-flex h-100 flex-column justify-content-around align-items-center">
                <div className="align-items-center d-flex flex-column gap-3">
                    <h1 className="text-white">{data?.username}</h1>
                    <img className="profile-img" src={data?.profileimage} alt="profile" />
                    <span className="text-white position-relative d-flex flex-row align-items-baseline gap-1">
                        {!videoCall || !voiceCall ? "Calling" : "Ongoing call"}
                        {!videoCall || !voiceCall && <PulseLoader color="#ffffff" margin={7} size={7} speedMultiplier={0.6} />}
                    </span>
                </div>
                <motion.img
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="cancel"
                    onClick={endCall}
                    src={cancelIcon}
                    alt="cancel"
                />
            </div>
        </div>
    );
}

export default Call;
