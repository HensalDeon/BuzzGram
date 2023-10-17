import PropTypes from "prop-types";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
function ProfileModal({ editOpened, setEditOpened, data }) {
    const [editProfile, setEditProfile] = useState({
        username: data.username,
        fullname: data.fullname,
        bio: data.bio,
    });

    const handleEditClose = () => setEditOpened(false);
    const maxBioLength = 100;
    const handleEditInput = (e) => {
        const { name, value } = e.target;

        if (name === "bio" && value.length > maxBioLength) {
            return;
        }

        setEditProfile((prevEditData) => ({
            ...prevEditData,
            [name]: value,
        }));
    };

    return (
        <>
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
                        <textarea style={{width:"100%"}} type="text" name="bio" value={editProfile.bio} onChange={handleEditInput} />
                    </div>
                    <div style={{ display: "flex" }}>
                        <span className="lg-text">
                            {maxBioLength - editProfile.username.length} / {maxBioLength}
                        </span>
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
