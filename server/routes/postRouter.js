import { Router } from "express";
const router = Router();

import * as postController from "../controllers/postController.js"

router.route('/').post(postController.createPost);

export default router;