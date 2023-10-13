import { Router } from "express";
const router = Router();

import Auth from "../middleware/auth.js";

/** import all controllers */
import * as adminController from "../controllers/adminController.js";

// /** GET methods */
router.route("/userlist").get(Auth, adminController.getUserList);
router.route("/action").put(Auth, adminController.blockUnblockUser);

// /** POST methods */
// router.route('/search').post(controller.searchUser);
// router.route('/update-userdetails/:userId').post(controller.updateUser);
// router.route('/admin-login').post(controller.adminLogin);

// /** PATCH methods */
// router.route('/enable-user/:userId').patch(controller.enableUser);

// /** DELETE methods */
// router.route('/delete-user/:userId').delete(controller.deleteUser);

export default router;
