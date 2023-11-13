import { Router } from "express";
const router = Router();
import Auth from "../middleware/auth.js";
import upload from "../config/multer.js";
import { uploadImage } from "../controllers/uploadController.js";

/** POST Requests */
router.route("/").post(Auth, upload.single("file"), uploadImage);

export default router;
