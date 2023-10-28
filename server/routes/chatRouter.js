import { Router } from "express";
const router = Router();

import * as chatController from "../controllers/chatController.js";

/** GET Requests */
router.route("/:userId").get(chatController.userChats);
router.route("/find/:firstId/:secondId").get(chatController.findChat);

/** POST Requests */
router.route("/").post(chatController.createChat);

export default router;

