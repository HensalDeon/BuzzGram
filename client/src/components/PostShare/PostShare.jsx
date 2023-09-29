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
        console.log(newImage,'💥💥💥')

        if (newImage) {
            const formData = new FormData();
            formData.append("file", newImage.file);
            console.log(formData, "🐠🐠", newImage.file);
            try {
                const response = await dispatch(uploadImage(formData));
                console.log(response);
                if (response && response.url) {
                    newPost.image = response.url;
                } else {
                    toast.error(<b>Failed to Upload Image</b>);
                }
            } catch (err) {
                toast.error(<b>Failed to Upload Image</b>);
                console.log(err);
            }
        }
        try {
            await dispatch(uploadPost(newPost));
            if (!error) {
                resetShare();
                return toast.success(<b>Post uploaded successfully..!</b>);
            } else {
                toast.error(<b>Failed to upload post</b>);
            }
        } catch (error) {
            toast.error(<b>Failed to Upload</b>);
            console.log(error);
        }
    };

    // Reset Post Share
    const resetShare = () => {
        setImage(null);  
        setCroppedImage(null)
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
                setCroppedBlob({file});
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
                            autoCropArea={1}
                            checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                            guides={true}
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
