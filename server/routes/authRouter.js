import { Router } from "express";
const router = Router();

import * as authController from '../controllers/authController.js'

router.route('/register').post(authController.registerUser); //resiter user
router.route('/login').post(authController.loginUser); //login user
router.route('/otp-signup').post(authController.signupOtpGenerate); //Otp generation for signup
router.route('/verify-otp').post(authController.otpVerification); //Otp verification

export default router;