import { Router } from "express";
const router = Router();
// import { registerMail } from "../controllers/mailer.js";
// import Auth, {localVariables} from "../middleware/auth.js";


// /** import all controllers */
// import * as userController from '../controllers/userController.js'
import * as authController from '../controllers/authController.js'

// /** POST methods */
router.route('/register').post(authController.registerUser); //resiter user
// router.route('/register-mail').post(registerMail); //send the email
// router.route('/authenticate').post(controller.verifyUser, (req,res)=> res.end()); //authenticate user
// router.route('/login').post(controller.verifyUser, controller.login); //login in app
router.route('/otp-signup').post(authController.signupOtpGenerate); //Otp generation for signup
router.route('/otp-signup').post(authController.verifyOtp); //Otp verification


// /** GET methods */
// router.route('/user/:username').get(controller.getUser); //user with username
// router.route('/generateOTP').get(controller.verifyUser, localVariables, controller.generateOTP); //generate random OTP
// router.route('/verifyOTP').get(controller.verifyUser, controller.verifyOTP); // verify generated OTP
// router.route('/create-resetSession').get(controller.createResetSession); //reset all the variable


// /** PUT methods */
// router.route('/update-user').put(Auth, controller.updateUser); //is use to update the user profile
// router.route('/reset-password').put(controller.verifyUser, controller.resetPassword); //use to reset password

export default router;