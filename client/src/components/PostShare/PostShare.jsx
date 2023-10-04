import Cropper from "react-cropper";
import toast, { Toaster } from "react-hot-toast";
import "cropperjs/dist/cropper.css";
import { useState, useRef } from "react";
import ProfileImage from "../../img/profileImg.jpg";
import "./PostShare.scss";
import { UilScenery } from "@iconscout/react-unicons";
import { UilTimes } from "@iconscout/react-unicons";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage, uploadPost } from "../../redux/actions/UploadAction";
import { getTimelinePosts } from "../../redux/actions/PostAction";
// import { UilEdit } from "@iconscout/react-unicons";

const PostShare = () => {
    const { user } = useSelector((state) => state.authReducer.authData);
    const uploading = useSelector((state) => state.postReducer.uploading);
    const error = useSelector((state) => state.postReducer.error);
    const dispatch = useDispatch();
    const [image, setImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const [croppedBlob, setCroppedBlob] = useState(null);
    const imageRef = useRef();
    const cropperRef = useRef();
    const description = useRef();

    // handle post upload
    const handleUpload = async (e) => {
        e.preventDefault();
        if (!description.current.value && !imageRef.current.value) {
            return toast.error(<b>Please Provide the Details!</b>);
        } else if (!description.current.value) {
            return toast.error(<b>Please Provide Description..!</b>);
        } else if (!imageRef.current.value) {
            return toast.error(<b>Please Provide an Image...!</b>);
        }

        //post data
        const newPost = {
            user: user._id,
            description: description.current.value,
        };
        const newImage = croppedImage ? croppedBlob : image;

        if (newImage && validateImage(newImage)) {
            const formData = new FormData();
            formData.append("file", newImage.file);
            try {
                const response = await dispatch(uploadImage(formData));
                if (response && response.url) {
                    newPost.image = response.url;
                    try {
                        await dispatch(uploadPost( newPost ));
                        if (!error) {
                            resetShare();
                            dispatch(getTimelinePosts(user._id));
                            return toast.success(<b>Post uploaded successfully..!</b>);
                        } else {
                            toast.error(<b>Failed to upload post</b>);
                        }
                    } catch (error) {
                        toast.error(<b>Failed to Upload</b>);
                        console.log(error);
                    }
                } else {
                    toast.error(<b>Failed to Upload Image</b>);
                }
            } catch (err) {
                toast.error(<b>Failed to Upload Image...!{error}</b>);
                console.log(err);
            }
        }
    };

    const validateImage = (file) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        const maxSize = 4 * 1024 * 1024; // 4MB
        if (!allowedTypes.includes(file.file.type)) {
            toast.error(<b>Only JPEG, JPG and PNG images are allowed</b>);
            return false;
        }
        if (file.file.size > maxSize) {
            toast.error(<b>The image size cannot exceed 2MB</b>);
            return false;
        }
        return true;
    };

    // Reset Post Share
    const resetShare = () => {
        setImage(null);
        setCroppedImage(null);
        description.current.value = "";
    };
    const onImageChange = (event) => {
        setCroppedImage(null);
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            setImage({
                name: img.name,
                url: URL.createObjectURL(img),
                file: img,
            });
        }
    };
    const cropImage = () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
            toast.success(<b>Cropped!!</b>);
            const croppedCanvas = cropperRef.current?.cropper.getCroppedCanvas();
            setCroppedImage(croppedCanvas.toDataURL());

            croppedCanvas.toBlob(function(blob) {
                const file = new File([blob], image.name, { type: blob.type });
                setCroppedBlob({ file });
            }, image.type);
        }
    };

    return (
        <div className="PostShare">
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <img src={ProfileImage} alt="" />
            <div>
                <input type="text" placeholder="What's happening" ref={description} />
                <div className="postOptions">
                    <div className="option" style={{ color: "var(--photo)" }} onClick={() => imageRef.current.click()}>
                        <UilScenery />
                        Photo
                    </div>
                    <button className="button ps-button" onClick={handleUpload} disabled={uploading}>
                        {uploading ? "Sharing..." : "Share"}
                    </button>
                    <div style={{ display: "none" }}>
                        <input type="file" name="myImage" ref={imageRef} onChange={onImageChange} />
                    </div>
                </div>
                {image && (
                    <div>
                        <button className="crop-button" onClick={cropImage}>
                            <span className="material-symbols-outlined">screenshot_region</span>
                        </button>
                        <button
                            className="close-button"
                            onClick={() => {
                                setImage(null), setCroppedImage(null);
                            }}
                        >
                            <span className="material-symbols-outlined">close </span>
                        </button>
                        <Cropper
                            ref={cropperRef}
                            src={image.url}
                            aspectRatio={2}
                            background={false}
                            responsive={true}
                            // autoCropArea={1}
                        />
                    </div>
                )}
                {croppedImage && (
                    <>
                        <span>Preview</span>
                        <div className="previewImage bg-dark">
                            <UilTimes onClick={() => setCroppedImage(null)} />
                            <img src={croppedImage} alt="Cropped" />
                            {/* <UilEdit  /> */}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PostShare;
