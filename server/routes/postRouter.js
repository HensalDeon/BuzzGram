import { Router } from "express";
const router = Router();

import * as postController from "../controllers/postController.js";
import * as commentController from "../controllers/commentController.js";
import Auth from "../middleware/auth.js";

router.route("/").post(Auth, postController.createPost);
router.route("/like-comment").post(Auth, commentController.likeComment);
router.route("/:id/update-comment").put(Auth, commentController.updateComment);
router.route("/comment").post(Auth, commentController.createComment);

router.route("/:id/timeline").get(Auth, postController.getTimelinePosts);
router.route("/:id/comments").get(commentController.getComments);

router.put("/:id/like", Auth, postController.likePost);
router.put("/:id", Auth, postController.updatePost);

router.delete("/:id", Auth, postController.deletePost);

export default router;
