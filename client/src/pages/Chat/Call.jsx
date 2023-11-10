import { useDispatch, useSelector } from "react-redux";
import cancelIcon from "../../img/icon-flatCancel.svg";
import mute from "../../img/icon-flatMute.svg";
import muteVideo from "../../img/icon-flatMuteVd.svg";
import { motion } from "framer-motion";
import PulseLoader from "react-spinners/PulseLoader";
import { useEffect, useState } from "react";
import { join, leave } from "../../utils/agora";

function Call({ data, socket }) {
    const dispatch = useDispatch();
    const { videoCall } = useSelector((state) => state.chatReducer);
    const [callAccepted, setCallAccepted] = useState(false);

    useEffect(() => {
        if (videoCall) {
            join();
        }
        return () => {
            leave();
        };
    }, [videoCall]);

    useEffect(() => {
        if (data?.type === "out-going") {
            socket.on("accept-call", () => {
                setCallAccepted(true);
            });
        } else {
            setCallAccepted(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const endCall = () => {
        leave();
        if (data?.callType === "voice") {
            socket.emit("reject-voice-call", { from: data._id || data.id });
        } else {
            console.log(data);
            socket.emit("reject-video-call", { from: data._id || data.id });
        }
        dispatch({ type: "END_CALL" });
    };

    return (
        <div className="image-modal">
            <div className="d-flex h-100 flex-column justify-content-around align-items-center">
                <div className="align-items-center d-flex flex-column gap-3">
                    <h1 className="text-white">{data?.username}</h1>
                    {!callAccepted && <img className="profile-img" src={data?.profileimage} alt="profile" />}
                    <span className="text-white position-relative d-flex flex-row align-items-baseline gap-1">
                        {!callAccepted ? "Calling" : "Ongoing call"}
                        {!callAccepted && <PulseLoader color="#ffffff" margin={7} size={7} speedMultiplier={0.6} />}
                    </span>
                </div>
                <div className="d-flex gap-5">
                    {!callAccepted && (
                        <motion.img
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            className="cancel"
                            src={muteVideo}
                            alt="mute-video"
                        />
                    )}
                    <motion.img
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        className="cancel"
                        onClick={endCall}
                        src={cancelIcon}
                        alt="cancel"
                    />
                    {!callAccepted && (
                        <motion.img
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            className="cancel"
                            src={mute}
                            alt="mute"
                        />
                    )}
                </div>
                <div className="remoteVideo" id="remote-video"></div>
                <div className={`${callAccepted ? "localVideo" : "remoteVideo"}`} id="local-video"></div>
            </div>
        </div>
    );
}

export default Call;
