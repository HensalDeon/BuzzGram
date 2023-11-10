import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { join, leave, handleMuteAudio, handleMuteVideo } from "../../utils/agora";
import cancelIcon from "../../img/icon-flatCancel.svg";
import mute from "../../img/icon-flatMute.svg";
import muteVideo from "../../img/icon-flatMuteVd.svg";
import PulseLoader from "react-spinners/PulseLoader";
import PropTypes from 'prop-types';

function Call({ data, socket }) {
    const dispatch = useDispatch();
    const callAcceptedRef = useRef(callAccepted);
    const { videoCall, voiceCall } = useSelector((state) => state.chatReducer);
    const [callAccepted, setCallAccepted] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const [isAudioMuted, setIsAudioMuted] = useState(false);

    // check weather call is accepted 
    useEffect(() => {
        callAcceptedRef.current = callAccepted;
    }, [callAccepted]);

    // setting agora to make video connection
    useEffect(() => {
        if (videoCall || voiceCall) {
            const callType = videoCall?.callType || voiceCall?.callType;
            join(callType);
            setTimeout(() => {
                if (!callAcceptedRef.current) {
                    endCall();
                }
            }, 7000);
        }
        return () => {
            leave();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoCall, voiceCall]);

    // setting call acceptance
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

    // end the call
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

    // controll calling features
    const handleActions = (type) => {
        if (type === "video") {
            handleMuteVideo(isVideoMuted);
        }
        if (type === "audio") {
            handleMuteAudio(isAudioMuted);
        }
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
                    {callAccepted && videoCall?.callType == "video" && (
                        <div className={`rounded-circle ${isVideoMuted ? "active" : null}`}>
                            <motion.img
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                onClick={() => {
                                    setIsVideoMuted((prev) => !prev), handleActions("video");
                                }}
                                className="action-icon"
                                src={muteVideo}
                                alt="mute-video"
                            />
                        </div>
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
                    {callAccepted && (
                        <div className={`rounded-circle ${isAudioMuted ? "active" : null}`}>
                            <motion.img
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                onClick={() => {
                                    setIsAudioMuted((prev) => !prev), handleActions("audio");
                                }}
                                className="action-icon"
                                src={mute}
                                alt="mute"
                            />
                        </div>
                    )}
                </div>
                <div className="remoteVideo bg-dark" id="remote-video"></div>
                <div className={`bg-dark ${callAccepted ? "localVideo" : "remoteVideo"}`} id="local-video"></div>
            </div>
        </div>
    );
}

Call.propTypes = {
    data: PropTypes.shape({
        type: PropTypes.string,
        username: PropTypes.string,
        profileimage: PropTypes.string,
        callType: PropTypes.string,
        _id: PropTypes.string,
        id: PropTypes.string,
    }),
    socket: PropTypes.object,
};

export default Call;
