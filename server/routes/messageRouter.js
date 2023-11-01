import { Router } from "express";
const router = Router();

import * as messageController from "../controllers/messageController.js";
import Auth from "../middleware/auth.js";

/** GET Requests */
router.route("/:chatId").get(Auth, messageController.getMessages);

/** POST Requests */
router.route("/").post(Auth, messageController.addMessage);

export default router;
