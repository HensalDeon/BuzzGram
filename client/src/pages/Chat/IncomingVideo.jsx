// /* eslint-disable react/prop-types */
// import { motion } from "framer-motion";
// import accept from "../../img/icon-flatAccept.svg";
// import cancelIcon from "../../img/icon-flatCancel.svg";
// import PulseLoader from "react-spinners/PulseLoader";
// import { useDispatch, useSelector } from "react-redux";
// function IncomingVideo({ data, socket }) {
//     const dispatch = useDispatch();
//     const { incomingVideoCall } = useSelector((state) => state.chatReducer);

//     const acceptCall = () => {
//         dispatch({
//             type: "SET_VIDEO_CALL",
//             videoCall: {
//                 ...incomingVideoCall,
//                 type: "in-coming",
//             },
//         });
//         socket.current.emit("accept-incoming-call", {
//             id: incomingVideoCall.id,
//         });
//         dispatch({ type: "SET_INCOMING_VIDEO_CALL", incomingVideoCall: undefined });
//     };

//     const rejectCall = () => {
//         socket.current.emit("reject-video-call", { from: incomingVideoCall.id });
//         dispatch({ type: "END_CALL" });
//     };

//     return (
//         <div className="incoming d">
//             <div className="d-flex flex-row">
//                 <img className="inc-profile" src={data?.profileimage} alt="profile" />
//                 <div className="d-flex flex-column">
//                     <span className="text-white">{data?.username}</span>
//                     <span className="text-black position-relative d-flex flex-row align-items-baseline gap-1">
//                         Incoming <PulseLoader color="#00000" margin={7} size={5} speedMultiplier={0.6} />
//                     </span>
//                 </div>
//             </div>
//             <div className="d-flex flex-row gap-3">
//                 <motion.img
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                     transition={{ type: "spring", stiffness: 400, damping: 17 }}
//                     className="icons"
//                     src={accept}
//                     alt="accept"
//                     onClick={acceptCall}
//                 />
//                 <motion.img
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                     transition={{ type: "spring", stiffness: 400, damping: 17 }}
//                     className="icons"
//                     src={cancelIcon}
//                     alt="accept"
//                     onClick={rejectCall}
//                 />
//             </div>
//         </div>
//     );
// }

// export default IncomingVideo;

/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import accept from "../../img/icon-flatAccept.svg";
import cancelIcon from "../../img/icon-flatCancel.svg";
import PulseLoader from "react-spinners/PulseLoader";
import { useDispatch, useSelector } from "react-redux";
function IncomingVideo({ data, socket }) {
    const dispatch = useDispatch();
    const { incomingVideoCall } = useSelector((state) => state.chatReducer);

    const acceptCall = () => {
        dispatch({
            type: "SET_VIDEO_CALL",
            videoCall: {
                ...incomingVideoCall,
                type: "in-coming",
            },
        });
        socket.current.emit("accept-incoming-call", {
            id: incomingVideoCall.id,
        });
        dispatch({ type: "SET_INCOMING_VIDEO_CALL", incomingVideoCall: undefined });
    };

    const rejectCall = () => {
        socket.current.emit("reject-video-call", { from: incomingVideoCall.id });
        dispatch({ type: "END_CALL" });
    };

    return (
        <div className="incoming d">
            <div className="d-flex flex-row">
                <img className="inc-profile" src={data?.profileimage} alt="profile" />
                <div className="d-flex flex-column">
                    <span className="text-white">{data?.username}</span>
                    <span className="text-black position-relative d-flex flex-row align-items-baseline gap-1">
                        Incoming <PulseLoader color="#00000" margin={7} size={5} speedMultiplier={0.6} />
                    </span>
                </div>
            </div>
            <div className="d-flex flex-row gap-3">
                <motion.img
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="icons"
                    src={accept}
                    alt="accept"
                    onClick={acceptCall}
                />
                <motion.img
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="icons"
                    src={cancelIcon}
                    alt="accept"
                    onClick={rejectCall}
                />
            </div>
        </div>
    );
}

export default IncomingVideo;
