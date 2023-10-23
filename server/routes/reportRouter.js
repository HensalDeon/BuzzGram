import { Router } from "express";
const router = Router();

import * as reportController from "../controllers/reportController.js";
import Auth from "../middleware/auth.js";

/** Get Requests */
router.route("/").get(Auth, reportController.getAllReports);
router.route("/target/:id/:targetType").get(Auth, reportController.getTargetData);

/** POST Requests */
router.route("/").post(Auth, reportController.createReport);

/** PUT Requests */
router.route("/:id/:reportId").put(Auth, reportController.updateReport);

/** DELETE Request */
router.route("/:id").delete(reportController.deleteReport);

export default router;
