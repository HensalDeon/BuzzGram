import { useState } from "react";
import avatar from "../../img/icon-accounts.svg";
import blockUser from "../../img/icon-blockUser.svg";
import unblock from "../../img/icon-unblock.svg";
import PropTypes from "prop-types";
import { blockUnblockUser } from "../../redux/actions/AdminActions";
import { useDispatch } from "react-redux";
import Modal from "react-bootstrap/Modal";
import toast from "react-hot-toast";

function List({ user }) {
    const dispatch = useDispatch();
    const [show, setShow] = useState(false);
    const [blocked, setBlocked] = useState(user.isblocked);
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "short", day: "numeric" };
        const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
        return formattedDate;
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleBlock = () => {
        setShow(false);
        dispatch(blockUnblockUser(user._id));
        if (blocked) {
            toast.success(<b>User was Unblocked 👍</b>);
            setBlocked(false);
        } else {
            toast.success(<b>User is blocked 👍</b>);
            setBlocked(true);
        }
    };
    return (
        <>
            <tr className="table-row" key={user._id}>
                <td className="table-cell">
                    <div className="image-container">
                        <img src={user.profileimage || avatar} alt="" className="avatar" />
                    </div>
                </td>
                <td className="table-cell">{user.username}</td>
                <td className="table-cell">{user.email}</td>
                <td className="table-cell">{formatDate(user.createdAt)}</td>
                <td className="table-cell">{user.phone}</td>
                <td className="table-cell">
                    <span className={blocked ? "red" : "green"}>{blocked ? "disabled" : "enabled"}</span>
                </td>
                <td className="table-cell">
                    <div className="image-container">
                        <div className="flex">
                            <img onClick={handleShow} src={blocked ? unblock : blockUser} className="block" alt="action" />
                            <span>{blocked ? "unblock" : "block"}</span>
                        </div>
                    </div>
                </td>
            </tr>
            <Modal show={show} onHide={handleClose}>
                <Modal.Body style={{ width: "10rem" }}>
                    <img src={user.profileimage || avatar} alt="" />
                    <span className="lg-text pb-2">{!blocked ? "Block this user?" : "Unblock this User?"}</span>
                    <div className="cover">
                        <button className="button modalButton" onClick={handleClose}>
                            No!
                        </button>
                        <button className="button modalButton" onClick={handleBlock}>
                            Yes!
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
List.propTypes = {
    user: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        profileimage: PropTypes.string,
        username: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        isblocked: PropTypes.bool.isRequired,
    }).isRequired,
};

export default List;
