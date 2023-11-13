import { Router } from "express";
const router = Router();

import * as authController from "../controllers/authController.js";

/** POST Requests */
router.route("/register").post(authController.registerUser); //regiter user
router.route("/google-auth").post(authController.googleAuthentication); //google authenticated user
router.route("/login").post(authController.loginUser); //login user
router.route("/admin-login").post(authController.adminLogin); //login admin
router.route("/otp-signup").post(authController.signupOtpGenerate); //Otp generation for signup
router.route("/otp-recovery").post(authController.sendOtpRecovery); //Otp generation for recovery
router.route("/verify-otp").post(authController.otpVerification); //Otp verification

/** PUT Requests */
router.route("/forgot-password").put(authController.forgotPassword); //password updation

export default router;
