import { useState } from "react";
import avatar from "../../img/icon-accounts.svg";
import blockUser from "../../img/icon-blockUser.svg";
import unblock from "../../img/icon-unblock.svg";
import PropTypes from "prop-types";
import { blockUnblockUser } from "../../redux/actions/AdminActions";
import { useDispatch } from "react-redux";

function List({ user }) {
    const dispatch = useDispatch();
    const [blocked, setBlocked] = useState(user.isblocked);
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "short", day: "numeric" };
        const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
        return formattedDate;
    };

    const handleBlock = () => {
        dispatch(blockUnblockUser(user._id));
        if (blocked) {
            setBlocked(false);
        } else {
            setBlocked(true);
        }
    };

    return (
        <tr className="table-row" key={user._id}>
            <td className="table-cell">
                <div className="image-container">
                    {/* {index + 1} */}
                    <img src={user.profileimage || avatar} alt="" className="avatar" />
                </div>
            </td>
            <td className="table-cell">{user.username}</td>
            <td className="table-cell">{user.email}</td>
            <td className="table-cell">{formatDate(user.createdAt)}</td>
            <td className="table-cell">{user.phone}</td>
            <td className="table-cell">{user.isblocked ? "unblock" : "block"}</td>
            <td className="table-cell">
                <div className="image-container">
                    <div className="flex">
                        <img
                            onClick={handleBlock}
                            src={blocked ? unblock : blockUser}
                            className="block"
                            alt="action"
                        />
                        <span>{blocked ? "unblock" : "block"}</span>
                    </div>
                </div>
            </td>
        </tr>
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
