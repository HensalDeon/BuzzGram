import "./Notification.scss";
import avatar from "../../img/icon-accounts.svg";
import delelteIcon from "../../img/icon-flatDeleteIcon.svg";
import Modal from "react-bootstrap/Modal";
import { motion } from "framer-motion";
import { format } from "timeago.js";
const Notification = ({ notifications, setShowModal, showModal }) => {
    const handleClose = () => {
        setShowModal(false);
    };
    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Body style={{ overflow: "scroll", maxHeight: "14rem" }}>
                <div className="d-flex justify-content-between pb-1">
                    <h3 className="lg-text">Notifications</h3>
                    <motion.img
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        src={delelteIcon}
                        style={{ width: "1.7rem", cursor: "pointer" }}
                        alt="del"
                    />
                </div>
                <div className="d-flex flex-column">
                    {notifications?.map((notification) => (
                        <div className="d-flex py-2" key={notification?._id} style={{ borderBottom: "1px solid white" }}>
                            <img
                                className="rounded-circle"
                                src={notification?.senderId?.profileimage || avatar}
                                style={{ width: "3rem", height:"3rem" }}
                                alt=""
                            />
                            <div className="d-flex flex-column align-items-start px-2">
                                <b className="text-white">{notification?.senderId?.username}</b>
                                <span className="text-white text-nowrap">{notification?.text}</span>
                                <span style={{color:"#828282", fontSize:"13px"}}>{format(notification?.createdAt)}</span>
                            </div>
                            {notification?.url && (
                                <img
                                    className="rounded"
                                    src={notification?.url || avatar}
                                    style={{ width: "3rem" }}
                                    alt=""
                                />
                            )}
                        </div>
                    ))}
                    {notifications?.length == 0 && <span>You have read all</span>}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default Notification;
