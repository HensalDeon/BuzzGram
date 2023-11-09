import { useEffect } from "react";
import avatar from "../../img/icon-accounts.svg";
import Modal from "react-bootstrap/Modal";
import { format } from "timeago.js";
import { setMarkAsRead } from "../../api/NotificationRequests";
import PropTypes from "prop-types";
const Notification = ({ notifications, setShowModal, showModal, user, length }) => {
    const handleClose = () => {
        setShowModal(false);
    };

    useEffect(() => {
        if (showModal) {
            setMarkAsRead(user?._id).catch((err) => console.log(err));
            length(0);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showModal]);
    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Body style={{ overflow: "scroll", maxHeight: "14rem" }}>
                <h3 className="lg-text">Notifications</h3>
                <div className="d-flex flex-column">
                    {notifications?.map((notification) => (
                        <div className="d-flex py-2" key={notification?._id} style={{ borderBottom: "1px solid white" }}>
                            <img
                                className="rounded-circle"
                                src={notification?.senderId?.profileimage || avatar}
                                style={{ width: "2.8rem", height: "2.8rem" }}
                                alt=""
                            />
                            <div className="d-flex flex-column align-items-start px-2">
                                <b className="text-white" style={{ fontSize: "12px" }}>
                                    {notification?.senderId?.username}
                                </b>
                                <span className="text-white text-nowrap" style={{ fontSize: "14px" }}>
                                    {notification?.text}
                                </span>
                                <span style={{ color: "#828282", fontSize: "11px" }}>
                                    {format(notification?.createdAt)}
                                </span>
                            </div>
                            {notification?.url && (
                                <img
                                    className="rounded"
                                    src={notification?.url || avatar}
                                    style={{ width: "3rem",height:"3rem" }}
                                    alt=""
                                />
                            )}
                        </div>
                    ))}
                    {notifications?.map((notification) => (
                        <div className="d-flex py-2" key={notification?._id} style={{ borderBottom: "1px solid white" }}>
                            <img
                                className="rounded-circle"
                                src={notification?.senderId?.profileimage || avatar}
                                style={{ width: "2.8rem", height: "2.8rem" }}
                                alt=""
                            />
                            <div className="d-flex flex-column align-items-start px-2">
                                <b className="text-white" style={{ fontSize: "12px" }}>
                                    {notification?.senderId?.username}
                                </b>
                                <span className="text-white text-nowrap" style={{ fontSize: "14px" }}>
                                    {notification?.text}
                                </span>
                                <span style={{ color: "#828282", fontSize: "11px" }}>
                                    {format(notification?.createdAt)}
                                </span>
                            </div>
                            {notification?.url && (
                                <img
                                    className="rounded"
                                    src={notification?.url || avatar}
                                    style={{ width: "3rem",height:"3rem" }}
                                    alt=""
                                />
                            )}
                        </div>
                    ))}
                    {notifications?.length == 0 && <span className="text-white">No new notification!</span>}
                </div>
            </Modal.Body>
        </Modal>
    );
};

Notification.propTypes = {
    notifications: PropTypes.array.isRequired,
    setShowModal: PropTypes.func.isRequired,
    showModal: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
    length: PropTypes.func.isRequired,
};

export default Notification;
