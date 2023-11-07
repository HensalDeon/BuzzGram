import { Router } from "express";
const router = Router();

import * as postController from "../controllers/postController.js";
import * as commentController from "../controllers/commentController.js";
import Auth from "../middleware/auth.js";

/**GET Requests */
router.route("/:id").get(postController.getUserPosts);
router.route("/:id/all").get(Auth, postController.getAllPosts);
router.route("/:id/admin").get(postController.getAllPostsByAdmin);
router.route("/:id/timeline").get(Auth, postController.getTimelinePosts);
router.route("/:id/comments").get(Auth, commentController.getComments);
router.route("/:id/saved").get(Auth, postController.getSavedPosts);
router.route("/:id/liked-users").get( postController.getLikedUsersDetails);

/**POST Requests */
router.route("/").post(Auth, postController.createPost);
router.route("/like-comment").post(Auth, commentController.likeComment);
router.route("/comment").post(Auth, commentController.createComment);

/**PUT Requests */
router.route("/:id/update-comment").put(Auth, commentController.updateComment);
router.route("/:id/like").put(Auth, postController.likePost);
router.route("/:id").put(Auth, postController.updatePost);

/**PATCH Requests */
router.route("/:id/:postId/:isSaved").patch(Auth, postController.savePost);

/**DELETE Requests */
router.route("/:id").delete(Auth, postController.deletePost);
router.route("/:id/comment").delete(Auth, commentController.deleteComment);

export default router;
