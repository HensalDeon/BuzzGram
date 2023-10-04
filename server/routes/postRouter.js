import { Router } from "express";
const router = Router();

import * as postController from "../controllers/postController.js";
import Auth from "../middleware/auth.js";

router.route("/").post(Auth, postController.createPost);

router.route("/:id/timeline").get(Auth, postController.getTimelinePosts);

router.put("/:id/like", Auth, postController.likePost);
router.put("/:id", Auth, postController.updatePost);

router.delete("/:id", Auth, postController.deletePost);

export default router;
