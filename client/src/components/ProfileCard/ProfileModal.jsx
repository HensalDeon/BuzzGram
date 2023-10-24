import PropTypes from "prop-types";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/actions/UserAction";
// eslint-disable-next-line react/prop-types
function ProfileModal({ editOpened, setEditOpened, data, updateCurrUser }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.authReducer.authData);
    const [editProfile, setEditProfile] = useState({
        username: data.username,
        fullname: data.fullname,
        bio: data.bio,
    });
    const handleEditClose = () => {
        setEditOpened(false);
        setEditProfile({
            username: data.username,
            fullname: data.fullname,
            bio: data.bio,
        });
    };

    const maxBioLength = 50;
    const handleEditInput = (e) => {
        const { name, value } = e.target;

        if (name === "bio" && value.length > maxBioLength) {
            return toast.error(<b>Maximum characters reached!</b>);
        }

        setEditProfile((prevEditData) => ({
            ...prevEditData,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        setEditOpened(false);
        const loadingToastId = toast.loading("Updating...");
        try {
            const response = await dispatch(updateUser(user._id, editProfile));
            toast.dismiss(loadingToastId);
            if (response.success) {
                updateCurrUser(editProfile);
                toast.success(<b>{response.message}</b>);
            } else {
                toast.error(<b>{response.error}</b>);
            }
        } catch (error) {
            console.log(error, "///");
        }
    };

    return (
        <>
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <Modal show={editOpened} onHide={handleEditClose}>
                <Modal.Body style={{ width: "17rem" }}>
                    <label className="pt-2 pb-3 linear-gradient-text">Edit Profile?</label>
                    <div style={{ display: "flex" }}>
                        <span className="lg-text">User Name:</span>
                    </div>
                    <div className="Search my-2">
                        <input type="text" name="username" value={editProfile.username} onChange={handleEditInput} />
                    </div>
                    <div style={{ display: "flex" }}>
                        <span className="lg-text">Full Name:</span>
                    </div>
                    <div className="Search my-2">
                        <input type="text" name="fullname" value={editProfile.fullname} onChange={handleEditInput} />
                    </div>
                    <div style={{ display: "flex" }}>
                        <span className="lg-text">Bio:</span>
                    </div>
                    <div className="Search my-2">
                        <textarea
                            style={{ width: "100%" }}
                            type="text"
                            name="bio"
                            value={editProfile.bio}
                            onChange={handleEditInput}
                        />
                    </div>
                    <div style={{ display: "flex" }}>
                        <span className="lg-text">
                            {maxBioLength - editProfile.bio.length} / {maxBioLength}
                        </span>
                    </div>
                    <div className="d-flex flex-row-reverse">
                        <button className="button modalButton" onClick={handleSubmit}>
                            Yes!
                        </button>
                        <button className="button modalButton  mx-3" onClick={handleEditClose}>
                            No!
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

ProfileModal.propTypes = {
    editOpened: PropTypes.bool.isRequired,
    setEditOpened: PropTypes.func.isRequired,
    data: PropTypes.shape({
        username: PropTypes.string,
        fullname: PropTypes.string,
        bio: PropTypes.string,
    }),
};
export default ProfileModal;
