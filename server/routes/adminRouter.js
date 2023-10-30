import { Router } from "express";
const router = Router();

import Auth from "../middleware/auth.js";

/** import all controllers */
import * as adminController from "../controllers/adminController.js";

/** GET methods */
router.route("/userlist").get(Auth, adminController.getUserList);
router.route("/dashboard").get( adminController.getDashboardData);

/** POST methods */
router.route("/action").put(Auth, adminController.blockUnblockUser);


export default router;
