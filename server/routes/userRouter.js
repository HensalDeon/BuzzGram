import { Router } from "express";
const router = Router();

import * as userCotroller from "../controllers/userController.js";
import Auth from "../middleware/auth.js";

/** GET Requests */
router.route("/search").get(Auth, userCotroller.searchResult);

export default router;
