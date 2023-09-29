import cloudinary from "../config/cloudinary.js"

//upload image to cloudinary
export const uploadImage = async(req, res) => {
    try {
        let locaFilePath = req.file.path;
        let response = await cloudinary.uploader.upload(locaFilePath, {
            folder: 'buzzgram/user_uploads',
            unique_filename: true,
          });
        if(response.secure_url) return res.status(200).json({url:response.secure_url})
        return res.status(400).json({error: "Failed to upload Image...!"});
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error: "Internal Server Error" });
    }
}