import { Router } from "express";
const router = Router();

import * as messageController from "../controllers/messageController.js";

/** GET Requests */
router.route("/:chatId").get(messageController.getMessages);

/** POST Requests */
router.route("/").post(messageController.addMessage);

export default router;