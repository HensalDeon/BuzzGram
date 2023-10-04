import { Router } from "express";
const router = Router();

import * as reportController from "../controllers/reportController.js";
import Auth from "../middleware/auth.js";

router.route("/").post(Auth, reportController.createReport);
// router.route("/").get(reportController.getReports);
// router.route("/:reportId").get(reportController.getReportById);
// router.route("/:reportId").put(reportController.updateReport);
// router.route("/:reportId").delete(reportController.deleteReport);

export default router;
