import { Router } from "express";
const router = Router();

import * as userCotroller from "../controllers/userController.js";
import Auth from "../middleware/auth.js";

/** GET Requests */
router.route("/search").get(Auth, userCotroller.searchResult);
router.route("/").get(Auth, userCotroller.randomUsers);
router.route("/:id").get(Auth, userCotroller.getUser);
router.route("/:id/followers").get(userCotroller.getFollowersDetail);
router.route("/:id/following").get(userCotroller.getFollowingDetail);

/** PUT Requests */
router.route("/:id").put(Auth, userCotroller.updateUser);
router.route("/:id/profile").put(Auth, userCotroller.updateProfilePic);
router.route("/:id/cover").put(Auth, userCotroller.updateCoverPic);
router.route("/:id/follow").put(Auth, userCotroller.followUser);
router.route("/:id/unfollow").put(Auth, userCotroller.UnFollowUser);

export default router;
