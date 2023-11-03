// /* eslint-disable react/prop-types */
// import { useDispatch } from "react-redux";
// import cancelIcon from "../../img/icon-flatCancel.svg";
// import { motion } from "framer-motion";
// import PulseLoader from "react-spinners/PulseLoader";
// import { useEffect, useState } from "react";

// function Call({ data, socket }) {
//     const dispatch = useDispatch();
//     const [callAccepted, setCallAccepted] = useState(false);
//     useEffect(() => {
//         if (data?.type === "out-going") {
//             socket.current.on("accept-call", () => {
//                 setCallAccepted(true);
//             });
//         } else {
//             setTimeout(() => {
//                 setCallAccepted(true);
//             }, 1000);
//         }
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [data]);

//     const endCall = () => {
//         if (data?.callType === "voice") {
//             socket.current.emit("reject-voice-call", { from: data.id });
//         } else {
//             socket.current.emit("reject-video-call", { from: data.id });
//         }
//         dispatch({ type: "END_CALL" });
//     };

//     return (
//         <div className="image-modal">
//             <div className="d-flex h-100 flex-column justify-content-around align-items-center">
//                 <div className="align-items-center d-flex flex-column gap-3">
//                     <h1 className="text-white">{data?.username}</h1>
//                     {!callAccepted && <img className="profile-img" src={data?.profileimage} alt="profile" />}
//                     <span className="text-white position-relative d-flex flex-row align-items-baseline gap-1">
//                         {!callAccepted ? "Calling" : "Ongoing call"}
//                         {!callAccepted && <PulseLoader color="#ffffff" margin={7} size={7} speedMultiplier={0.6} />}
//                     </span>
//                 </div>
//                 <motion.img
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                     transition={{ type: "spring", stiffness: 400, damping: 17 }}
//                     className="cancel"
//                     onClick={endCall}
//                     src={cancelIcon}
//                     alt="cancel"
//                 />
//                 <div className="position-relative" id="remote-video">
//                     <div className="position-absolute" id="local-audio"></div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Call;

/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import cancelIcon from "../../img/icon-flatCancel.svg";
import { motion } from "framer-motion";
import PulseLoader from "react-spinners/PulseLoader";
import { useEffect, useState } from "react";
import { getGeneratedToken } from "../../api/AuthRequests";

function Call({ data, socket }) {
    const dispatch = useDispatch();
    const [callAccepted, setCallAccepted] = useState(false);
    const [token, setToken] = useState(undefined);
    const [zgVar, setZgVar] = useState(undefined);
    const [localStream, setLocalStream] = useState(undefined);
    const [publishStream, setPublishStream] = useState(undefined);
    const { user } = useSelector((state) => state.authReducer.authData);

    useEffect(() => {
        if (data?.type === "out-going") {
            console.log("entered");
            socket.current.on("accept-call", () => {
                console.log("accept cheythu");
                setCallAccepted(true);
            });
        } else {
            setTimeout(() => {
                setCallAccepted(true);
            }, 1000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        const getToken = async () => {
            try {
                const response = await getGeneratedToken(data?._id);
                setToken(response?.data?.token);
            } catch (error) {
                console.log(error);
            }
        };
        getToken();
    }, [callAccepted]);

    useEffect(() => {
        const startCall = async () => {
            const { ZegoExpressEngine } = await import("zego-express-engine-webrtc");
            console.log(typeof import.meta.env.VITE_ZEGO_APP_ID, "app id logging");
            const zg = new ZegoExpressEngine(
                parseInt(import.meta.env.VITE_ZEGO_APP_ID),
                import.meta.env.VITE_ZEGO_SERVER_ID
            );
            console.log(zg, "❤️❤️");
            setZgVar(zg);
            zg.on("roomStreamUpdate", async (roomID, updateType, streamList, extendedData) => {
                console.log(roomID, updateType, streamList, extendedData, "❤️❤️❤️❤️");
                if (updateType === "ADD") {
                    const rmVideo = document.getElementById("remote-video");
                    const vd = document.createElement(data.callType === "video" ? "video" : "audio");
                    vd.id = streamList[0].streamID;
                    vd.autoplay = true;
                    vd.playsInline = true;
                    vd.muted = false;
                    if (rmVideo) {
                        rmVideo.appendChild(vd);
                    }
                    zg.startPlayingStream(streamList[0].streamID, {
                        audio: true,
                        video: true,
                    }).then((stream) => (vd.srcObject = stream));
                } else if (updateType === "DELETE" && zg && localStream && streamList[0].streamID) {
                    zg.destroyStream(localStream);
                    zg.stopPublishingStream(streamList[0].streamID);
                    zg.logoutRoom(data.roomId.toString());
                    dispatch({ type: "END_CALL" });
                }
            });
            await zg.loginRoom(
                data.roomId.toString(),
                token,
                { userID: user._id.toString(), userName: user?.username },
                { userUpdate: true }
            );

            const localStream = await zg.createStream({
                camera: {
                    audio: true,
                    video: data.callType === "video" ? true : false,
                },
            });
            const locaVideo = document.getElementById("local-audio");
            const videoElement = document.createElement(data.callType === "video" ? "video" : "audio");
            videoElement.id = "video-local-zego";
            videoElement.className = "h-25 w-25";
            videoElement.autoplay = true;
            videoElement.muted = false;
            videoElement.playsInline = true;
            locaVideo.appendChild(videoElement);
            const td = document.getElementById("video-local-zego");
            td.srcObject = localStream;
            const streamID = "123" + Date.now();
            setPublishStream(streamID);
            setLocalStream(localStream);
            zg.startPublishingStream(streamID, localStream);
        };
        if (token) {
            startCall();
        }
    }, [token]);

    const endCall = () => {
        if (zgVar && localStream && publishStream) {
            zgVar.destroyStream(localStream);
            zgVar.stopPublishingStream(publishStream);
            zgVar.logoutRoom(data.roomId.toString());
        }
        if (data?.callType === "voice") {
            socket.current.emit("reject-voice-call", { from: data.id });
        } else {
            socket.current.emit("reject-video-call", { from: data.id });
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
                <motion.img
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="cancel"
                    onClick={endCall}
                    src={cancelIcon}
                    alt="cancel"
                />
                <div className="position-relative" id="remote-video">
                    <div className="position-absolute" id="local-audio"></div>
                </div>
            </div>
        </div>
    );
}

export default Call;
