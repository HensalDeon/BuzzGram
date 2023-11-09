import { Router } from "express";
const router = Router();

import Auth from "../middleware/auth.js";
import * as notificationController from "../controllers/notificationController.js";

/** GET Requests */
router.route("/:userId").get(notificationController.getNotifications);

/** POST Requests */
router.route("/").post(notificationController.createNotification);

/** PATCH Requests */
router.route("/:userId").patch(notificationController.markAsRead);

export default router;
