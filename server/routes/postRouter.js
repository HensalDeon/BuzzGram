import { Router } from "express";
const router = Router();

import * as postController from "../controllers/postController.js";

router.route("/").post(postController.createPost);

router.route("/:id/timeline").get(postController.getTimelinePosts);

router.put("/:id/like", postController.likePost);

router.delete("/:id", postController.deletePost);
export default router;
