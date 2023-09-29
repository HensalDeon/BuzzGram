// import { useState, useRef } from "react";
// import ProfileImage from "../../img/profileImg.jpg";
// import "./PostShare.scss";
// import { UilScenery } from "@iconscout/react-unicons";
// import { UilPlayCircle } from "@iconscout/react-unicons";
// import { UilTimes } from "@iconscout/react-unicons";

// const PostShare = () => {
//   const [image, setImage] = useState(null);
//   const imageRef = useRef();

//   const onImageChange = (event) => {
//     if (event.target.files && event.target.files[0]) {
//       let img = event.target.files[0];
//       setImage({
//         image: URL.createObjectURL(img),
//       });
//     }
//   };
//   return (
//     <div className="PostShare">
//       <img src={ProfileImage} alt="" />
//       <div>
//         <input type="text" placeholder="What's happening" />
//         <div className="postOptions">
//           <div className="option" style={{ color: "var(--photo)" }}
//           onClick={()=>imageRef.current.click()}
//           >
//             <UilScenery />
//             Photo
//           </div>
//           <div className="option" style={{ color: "var(--video)" }}>
//             <UilPlayCircle />
//             Video
//           </div>
//           <button className="button ps-button">Share</button>
//           <div style={{ display: "none" }}>
//             <input
//               type="file"
//               name="myImage"
//               ref={imageRef}
//               onChange={onImageChange}
//             />
//           </div>
//         </div>
//       {image && (

//         <div className="previewImage">
//           <UilTimes onClick={()=>setImage(null)}/>
//           <img src={image.image} alt="" />
//         </div>

//       )}

//       </div>
//     </div>
//   );
// };

// export default PostShare;

import Cropper from "react-cropper";
import toast, { Toaster } from "react-hot-toast";
import "cropperjs/dist/cropper.css";
import { useState, useRef } from "react";
import ProfileImage from "../../img/profileImg.jpg";
import "./PostShare.scss";
import { UilScenery } from "@iconscout/react-unicons";
import { UilTimes } from "@iconscout/react-unicons";
// import { UilEdit } from "@iconscout/react-unicons";

const PostShare = () => {
    const [image, setImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const imageRef = useRef();
    const cropperRef = useRef();

    const onImageChange = (event) => {
        setCroppedImage(null);
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            setImage(URL.createObjectURL(img));
        }
    };
    const cropImage = () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
            toast.success(<b>Cropped!!</b>);
            setCroppedImage(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
        }
    };

    return (
        <div className="PostShare">
            <Toaster position="top-center" reverseOrder={false}></Toaster>
            <img src={ProfileImage} alt="" />
            <div>
                <input type="text" placeholder="What's happening" />
                <div className="postOptions">
                    <div className="option" style={{ color: "var(--photo)" }} onClick={() => imageRef.current.click()}>
                        <UilScenery />
                        Photo
                    </div>
                    <button className="button ps-button">Share</button>
                    <div style={{ display: "none" }}>
                        <input type="file" name="myImage" ref={imageRef} onChange={onImageChange} />
                    </div>
                </div>
                {image && (
                    <div>
                        <button className="crop-button" onClick={cropImage}>
                            <span className="material-symbols-outlined">screenshot_region</span>
                        </button>
                        <Cropper
                            ref={cropperRef}
                            src={image}
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
