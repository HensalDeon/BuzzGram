import Cover from "../../img/cover.jpg";
import { Link, useNavigate } from "react-router-dom";
import defProfile from "../../img/icon-accounts.svg";
import unfollow from "../../img/icon-flatUnfollow.svg";
import follow from "../../img/icon-flatFollow.svg";
import editIcon from "../../img/icon-flatEdit.svg";
import editProfile from "../../img/icon-flatEditProfile.svg";
import avatar from "../../img/icon-accounts.svg";
import editCover from "../../img/icon-flatEditCoverImg.svg";
import chat from "../../img/icon-flatChatwith.svg";
import "./ProfileCard.scss";
import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUserPosts } from "../../api/PostsRequests";
import BeatLoader from "react-spinners/BeatLoader";
import PostView from "../Explore/PostView";
import Modal from "react-bootstrap/Modal";
import ProfileModal from "./ProfileModal";
import { followUser, unfollowUser, uploadCoverPic, uploadProfilePic } from "../../redux/actions/UserAction";
import toast from "react-hot-toast";
import { getTimelinePosts } from "../../redux/actions/PostAction";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { uploadImage } from "../../redux/actions/UploadAction";
import { motion } from "framer-motion";
import LikedUsersDetail from "../LikedUsersDetail/LikedUsersDetail";
import { getFollowers } from "../../api/UserRequests";

const ProfileCard = ({ location }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.authReducer.authData);
    const { id } = useParams();
    const [currUser, setCurrUser] = useState([]);
    const [expanded, setExpanded] = useState(false);
    const [followers, setFollowers] = useState(null);
    const [showFollowers, setShowFollowers] = useState(false);
    const [followersData, setFollowersData] = useState([]);
    const [showFollowing, setShowFollowing] = useState(false);
    const [followingData, setFollowingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataLoading, setDataLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [isFollowed, setIsFollowed] = useState(user?.following.includes(id));
    const [editOpened, setEditOpened] = useState(false);
    const [isProfile, setIsProfile] = useState(false);

    const [selectedImage, setSelectedImage] = useState(null);
    const [image, setImage] = useState(currUser?.user?.profileimage);
    const [coverImage, setCoverImage] = useState(currUser?.user?.coverimage);
    const [croppedBlob, setCroppedBlob] = useState(null);

    const fileInputRef = useRef(null);
    const cropperRef = useRef();

    const handleImageClick = (type) => {
        console.log(type);
        if (location === "profile") {
            fileInputRef.current.value = null;
            fileInputRef.current.click();
            type === "profile" ? setIsProfile(true) : setIsProfile(false);
        }
    };
    const handleProfileImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];

            console.log(img, "image");

            const fileExtension = img.name
                .split(".")
                .pop()
                .toLowerCase();

            const allowedExtensions = ["jpg", "jpeg", "png"];

            if (allowedExtensions.includes(fileExtension)) {
                setSelectedImage({
                    name: img.name,
                    url: URL.createObjectURL(img),
                    file: img,
                });
                handleShowProfile();
            } else {
                setSelectedImage(null);
                return toast.error(<b>Invalid file type. Please select a JPG, JPEG, or PNG image.</b>);
            }
        }
    };

    const validateImage = (file) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        const maxSize = 4 * 1024 * 1024;
        if (!allowedTypes.includes(file.file.type)) {
            toast.error(<b>Only JPEG, JPG and PNG images are allowed</b>);
            return false;
        }
        if (file.file.size > maxSize) {
            toast.error(<b>The image size cannot exceed 4MB</b>);
            return false;
        }
        return true;
    };

    // Reset Post Share
    const resetShare = () => {
        setSelectedImage(null);
        // setImage(null);
        setCroppedBlob(null);
    };

    const handleImageUpload = async (e) => {
        e.preventDefault();
        if (!selectedImage) return toast.error(<b>Please Provide an Image...!</b>);

        if (typeof cropperRef.current?.cropper !== "undefined") {
            const croppedCanvas = cropperRef.current?.cropper.getCroppedCanvas();
            isProfile ? setImage(croppedCanvas.toDataURL()) : setCoverImage(croppedCanvas.toDataURL());
            croppedCanvas.toBlob(function(blob) {
                const file = new File([blob], selectedImage.name, { type: blob.type });
                setCroppedBlob({ file });
            }, selectedImage.type);
        }
    };

    useEffect(() => {
        if (croppedBlob && validateImage(croppedBlob)) {
            const formData = new FormData();
            formData.append("file", croppedBlob.file);
            try {
                const uploadImages = async () => {
                    const loadtingToast = toast.loading(<b>uploading...!</b>);
                    setProfileLoading(true);
                    const response = await dispatch(uploadImage(formData));
                    if (response && response.url) {
                        // const profileimage = response.url;
                        const imageUploaded = response.url;

                        try {
                            const response = await dispatch(
                                isProfile
                                    ? uploadProfilePic(user._id, imageUploaded)
                                    : uploadCoverPic(user._id, imageUploaded)
                            );
                            toast.dismiss(loadtingToast);
                            if (response.success) {
                                handleProfileClose();
                                setProfileLoading(false);
                                resetShare();
                                toast.success(<b>{isProfile ? "Profile" : "Cover"} Pic Uploaded...!</b>);
                                currUser.posts.map((post) => {
                                    isProfile
                                        ? (post.user.profileimage = imageUploaded)
                                        : (post.user.coverimage = imageUploaded);
                                });
                            } else {
                                handleProfileClose();
                                setProfileLoading(false);
                                toast.error(<b>Failed to upload pic</b>);
                            }
                        } catch (error) {
                            handleProfileClose();
                            toast.dismiss(loadtingToast);

                            setProfileLoading(false);
                            toast.error(<b>Failed to Upload</b>);
                            console.log(error);
                        }
                    } else {
                        handleProfileClose();
                        toast.dismiss(loadtingToast);

                        setProfileLoading(false);
                        console.log("error aaahne");
                        toast.error(<b>Failed to Upload Image</b>);
                    }
                };
                uploadImages();
            } catch (err) {
                handleProfileClose();
                setProfileLoading(false);
                toast.error(<b>Failed to Upload Image...!</b>);
                console.log(err);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [croppedBlob]);

    const toggleExpand = () => {
        setExpanded(!expanded);
    };
    const handleClose = () => setShow(false);
    const handleProfileClose = () => setShowProfile(false);

    const handleShowProfile = () => setShowProfile(true);
    const handleShow = () => setShow(true);
    const handleEditProfile = () => {
        setEditOpened(true);
    };

    const handleFollowersView = async () => {
        try {
            setDataLoading(true);
            const response = await getFollowers(user?._id);
            if (response.data) {
                setFollowersData(response.data.followers);
                setDataLoading(false);
                setShowFollowers(true);
            }
        } catch (error) {
            setDataLoading(false);
            console.log(error);
            toast.error(<b>Couldn&#39;t get the details</b>);
        }
    };
    const handleFollowingView = async () => {
        try {
            setDataLoading(true);
            const response = await getFollowers(user?._id);
            if (response.data) {
                setFollowingData(response.data.following);
                setDataLoading(false);
                setShowFollowing(true);
            }
        } catch (error) {
            setDataLoading(false);
            console.log(error);
            toast.error(<b>Couldn&#39;t get the details</b>);
        }
    };

    const override = {
        display: "block",
        margin: "auto",
        marginTop: "20%",
    };

    const bioClassName = `truncate-text ${expanded ? "show-full-text" : ""}`;

    useEffect(() => {
        if (id || user._id) {
            getUserPosts(id || user._id)
                .then((res) => {
                    setLoading(false);
                    setCurrUser(res.data);
                    setFollowers(res.data.user.followers.length);
                })
                .catch(() => {
                    setLoading(false);
                });
        }
    }, [id, user._id]);

    const handleFollow = async () => {
        const loadingToastId = toast.loading("Following...");
        try {
            const response = await dispatch(followUser(id, user._id));
            if (response.success) {
                dispatch(getTimelinePosts(user._id));
                toast.success(<b>{response.message}</b>);
                setIsFollowed(!isFollowed);
                setFollowers((prev) => prev + 1);
            } else {
                toast.error(<b>{response.error}</b>);
            }
            toast.dismiss(loadingToastId);
        } catch (error) {
            toast.dismiss(loadingToastId);
            toast.error(<b>Cannot follow at the moment!</b>);
            console.error("Error:", error);
        }
    };

    const handleUnFollow = async () => {
        const loadingToastId = toast.loading("Unfollowing...");
        handleClose();
        try {
            const response = await dispatch(unfollowUser(id, user._id));
            if (response.success) {
                dispatch(getTimelinePosts(user._id));
                toast.success(<b>{response.message}</b>);
                setIsFollowed(!isFollowed);
                setFollowers((prev) => prev - 1);
            } else {
                toast.error(<b>{response.error}</b>);
            }
            toast.dismiss(loadingToastId);
        } catch (error) {
            toast.dismiss(loadingToastId);
            toast.error(<b>Can&#39;t Unfollow at the moment!</b>);
            console.error("Error:", error);
        }
    };

    const updateCurrUser = (newUserData) => {
        console.log(newUserData);
        setCurrUser((prev) => ({
            ...prev,
            user: {
                ...prev.user,
                ...newUserData,
            },
        }));
    };
    const handleChatClick = () => {
        dispatch({ type: "CURRENT_CHAT_USER", data: currUser?.user?._id });
        navigate("/chat");
    };

    return (
        <div
            className="ProfileCard"
            style={location === "profile" ? { overflowY: "auto", boxShadow: " rgb(208,86,155,0.3) 0px 0px 100px" } : {}}
        >
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
                <div className="ProfileImages">
                    <img
                        className={location === "profile" ? "profileCover" : ""}
                        src={!loading ? coverImage || currUser?.user?.coverimage || Cover : Cover}
                        alt="cover image"
                    />
                    {location === "profile" && currUser?.user?._id === user._id && (
                        <span>
                            <img
                                onClick={() => handleImageClick("cover")}
                                src={editCover}
                                className="editCover-icon"
                                alt="coverEdit"
                            />
                        </span>
                    )}
                    <img
                        className={location === "profile" ? "profileImg" : ""}
                        src={!loading ? image || currUser?.user?.profileimage || defProfile : defProfile}
                        alt="profile image"
                    />
                    {location === "profile" && currUser?.user?._id === user._id && (
                        <img
                            onClick={() => handleImageClick("profile")}
                            className="editProfile-icon"
                            src={editProfile}
                            alt="porfileEdit"
                        />
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        onChange={handleProfileImageChange}
                    />
                </div>
            </motion.div>

            <Modal show={showProfile} onHide={handleProfileClose} backdrop="static" keyboard={false}>
                <Modal.Body>
                    <Cropper
                        className="editPrImg"
                        ref={cropperRef}
                        src={selectedImage?.url}
                        aspectRatio={isProfile ? 1 : 2}
                        background={false}
                        responsive={true}
                    />
                    <div className="d-flex flex-row-reverse py-3 px-2 gap-2">
                        <button
                            className="button modaButton px-3 py-1"
                            onClick={handleImageUpload}
                            disabled={profileLoading}
                        >
                            Crop and Update
                        </button>
                        <button
                            onClick={() => {
                                setSelectedImage(null), setImage(null), setCroppedBlob(null), handleProfileClose();
                            }}
                            className="button modaButton px-3 py-1"
                            disabled={profileLoading}
                        >
                            Cancel
                        </button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* modal for confirm unfollow action */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Body style={{ width: "10rem" }}>
                    <img src={user.profileimage || avatar} alt="" />
                    <span className="lg-text pb-2">{isFollowed ? "Unfollow this user?" : "Follow this User?"}</span>
                    <div className="cover">
                        <button className="button modalButton" onClick={handleClose}>
                            No!
                        </button>
                        <button className="button modalButton" onClick={handleUnFollow}>
                            Yes!
                        </button>
                    </div>
                </Modal.Body>
            </Modal>

            {/* modal for edit profile */}
            {currUser?.user && (
                <ProfileModal
                    editOpened={editOpened}
                    setEditOpened={setEditOpened}
                    data={currUser?.user}
                    updateCurrUser={updateCurrUser}
                />
            )}

            {!loading ? (
                <>
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="ProfileName">
                            <span>
                                <span style={location === "profile" ? { fontSize: "20px", padding: "0 14px" } : {}}>
                                    {currUser.user?.username}
                                </span>
                                {user._id !== currUser.user._id && (
                                    <>
                                        <img
                                            title="chat"
                                            onClick={handleChatClick}
                                            style={{
                                                width: "2.4em",
                                                position: "absolute",
                                                cursor: "pointer",
                                                marginLeft: "3rem",
                                            }}
                                            src={chat}
                                            alt="chat"
                                        />
                                        {isFollowed ? (
                                            <img
                                                onClick={handleShow}
                                                title="unfollow user"
                                                style={{ width: "2.4em", position: "absolute", cursor: "pointer" }}
                                                src={unfollow}
                                                alt="unfollow"
                                            />
                                        ) : (
                                            <img
                                                onClick={handleFollow}
                                                title="follow user"
                                                style={{ width: "2.4em", position: "absolute", cursor: "pointer" }}
                                                src={follow}
                                                alt="follow"
                                            />
                                        )}
                                    </>
                                )}
                                {user._id == currUser.user._id && location === "profile" && (
                                    <img
                                        onClick={handleEditProfile}
                                        style={{ width: "2em", position: "absolute", cursor: "pointer" }}
                                        src={editIcon}
                                        alt="edit"
                                    />
                                )}
                            </span>
                            <span>{currUser.user?.fullname}</span>
                            <span className={bioClassName} onClick={toggleExpand}>
                                {currUser.user?.bio || "Write about yourself😊"}
                            </span>
                        </div>
                    </motion.div>

                    <div className="followStatus">
                        <hr />
                        <div>
                            <div className="follow" onClick={handleFollowersView}>
                                <span>{followers}</span>
                                <span>Followers</span>
                                <BeatLoader loading={dataLoading} color="orange" speedMultiplier={1} />
                            </div>
                            <div className="vl"></div>
                            <div className="follow" onClick={handleFollowingView}>
                                <span>{currUser.user?.following.length}</span>
                                <span>Followings</span>
                            </div>

                            {showFollowers && (
                                <LikedUsersDetail
                                    currUser={user}
                                    usersToShow={showFollowers}
                                    userDetails={followersData}
                                    setUsersToShow={setShowFollowers}
                                />
                            )}
                            {showFollowing && (
                                <LikedUsersDetail
                                    currUser={user}
                                    usersToShow={showFollowing}
                                    userDetails={followingData}
                                    setUsersToShow={setShowFollowing}
                                />
                            )}

                            {currUser.user && (
                                <>
                                    <div className="vl"></div>
                                    <div className="follow">
                                        <span>{currUser.posts.length}</span>
                                        <span>Posts</span>
                                    </div>
                                </>
                            )}
                        </div>
                        <hr />
                        {location === "home" && (
                            <span className="profileView">
                                <Link to={`/profile/${user._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                                    My Profile
                                </Link>
                            </span>
                        )}
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {location === "profile" && (
                                <div className="Post mb-3">
                                    <div className="explore">
                                        {currUser?.posts.map((post) => (
                                            <PostView postDtl={post} key={post._id} />
                                        ))}
                                        {currUser?.posts.length < 1 && (
                                            <b className="d-flex flex-row">
                                                No Posts Yet!<span className="material-symbols-outlined">photo_camera</span>
                                            </b>
                                        )}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            ) : (
                <BeatLoader loading={loading} cssOverride={override} color="orange" speedMultiplier={1} />
            )}
        </div>
    );
};

ProfileCard.propTypes = {
    location: PropTypes.string.isRequired,
};

export default ProfileCard;
