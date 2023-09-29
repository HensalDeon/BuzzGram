import { Router } from "express";
const router = Router();

import upload from "../config/multer.js";
import { uploadImage } from "../controllers/uploadController.js";

router.route("/").post(upload.single("file"),uploadImage);
// router.route("/").post(upload.single('file'),(req,res)=>{
//     console.log(req.body,'😊😊😊😊');
//     console.log(req.file,'😊😊');
// });

export default router;