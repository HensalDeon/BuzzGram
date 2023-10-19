import { Router } from "express";
const router = Router();

import * as userCotroller from "../controllers/userController.js";
import Auth from "../middleware/auth.js";

/** GET Requests */
router.route("/search").get(Auth, userCotroller.searchResult);

/** PUT Requests */
router.route("/:id").put(Auth, userCotroller.updateUser);
router.route("/:id/profile").put(Auth, userCotroller.updateProfilePic);
router.route("/:id/follow").put(Auth, userCotroller.followUser);
router.route("/:id/unfollow").put(Auth, userCotroller.UnFollowUser);

export default router;
