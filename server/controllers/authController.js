import UserModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import { hashPassword } from "../config/security.js";
import { sendOtp, verifyOtp } from "../config/twilio.js";
import jwt from "jsonwebtoken";
import generateToken04 from "../utils/tokenGenerator.js";
// Registering a new User
export const registerUser = async (req, res) => {
    try {
        const { fullname, username, email, password, phone } = req.body;
        const existingUsername = await UserModel.findOne({ username }).exec();
        if (existingUsername) {
            return res.status(400).send({ error: "Please use a unique username" });
        }

        const hashedPass = await hashPassword(password);

        const newUser = new UserModel({
            fullname,
            username,
            email,
            password: hashedPass,
            phone,
        });
        const user = await newUser.save();
        const token = createAccessToken(user);
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ error });
    }
};

//google authentication
export const googleAuthentication = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            const token = createAccessToken(user);
            if (user.isblocked) {
                return res.status(400).send({ error: "User is blocked." });
            }
            user.visited++;
            await user.save();
            user.password = "";
            return res.status(200).send({
                user,
                token,
            });
        } else {
            let { username, fullname, email, profileimage, password } = req.body;
            const existingUsername = await UserModel.findOne({ username }).exec();
            if (existingUsername) {
                username = `${username.split(" ").join("").toLowerCase()}_${
                    Date.now() + Math.random().toString(36).slice(-4)
                }`;
            }
            const hashedPass = await hashPassword(password);
            const newUser = new UserModel({
                fullname,
                username,
                email,
                password: hashedPass,
                profileimage,
            });
            const user = await newUser.save();
            const token = createAccessToken(user);
            user.visited++;
            await user.save();
            return res.status(200).json({ user, token });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
};

// login User
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username }).exec();
        if (!user) {
            return res.status(400).send({ error: "Username not Found" });
        }

        if (user.isblocked) {
            return res.status(400).send({ error: "User is blocked." });
        }

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.status(400).send({ error: "Password does not Match" });
        }

        user.visited++;
        await user.save();

        const token = createAccessToken(user);

        user.password = "";
        return res.status(200).send({
            user,
            token,
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
};

// login admin
export const adminLogin = async (req, res) => {
    try {
        const { adminName, password } = req.body;

        if (adminName === process.env.ADMIN_NAME && password === process.env.ADMIN_PASSWORD) {
            const token = createAccessToken(adminName);
            const admin = { name: adminName };
            return res.status(200).send({ admin, token });
        } else {
            return res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const signupOtpGenerate = async (req, res) => {
    try {
        const { phone } = req.body;
        const user = await UserModel.findOne({ phone });
        if (user) {
            return res.status(403).json({ error: "Phone number is already in use!" });
        }
        const otpSent = await sendOtp(phone);
        if (otpSent) {
            return res.status(200).json({ message: "OTP sent successfully" });
        } else {
            return res.status(500).json({ error: "Failed to send OTP" });
        }
    } catch (error) {
        console.error("Error in signupOtpSend:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const sendOtpRecovery = async (req, res) => {
    try {
        const { phone } = req.body;
        const user = await UserModel.findOne({ phone });
        if (!user) {
            return res.status(404).json({ error: "There isn't an account associated with this number" });
        }
        const otpSent = await sendOtp(phone);
        if (otpSent) {
            return res.status(200).json({ message: "OTP sent successfully" });
        } else {
            return res.status(500).json({ error: "Failed to send OTP" });
        }
    } catch (error) {
        console.error("Error in signupOtpSend:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const user = await UserModel.findOne({ phone }).exec();
        if (!user) {
            return res.status(400).send({ error: "User not Found" });
        }

        if (user.isblocked) {
            return res.status(400).send({ error: "User is blocked." });
        }

        const hashedPassword = await hashPassword(password);

        user.password = hashedPassword;
        await user.save();

        return res.status(200).send({ message: "Password updated successfully" });
    } catch (error) {
        console.error("An error occurred:", error);
        return res.status(500).send({ error: "Something went wrong" });
    }
};

export const otpVerification = async (req, res) => {
    try {
        const { otp, phone } = req.body;
        const isVerified = await verifyOtp(phone, otp);
        if (isVerified) {
            return res.status(200).json({ message: "OTP verified successfully" });
        } else {
            return res.status(400).json({ error: "Invalid OTP" });
        }
    } catch (error) {
        console.error("Error in otpVerification:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const generateToken = (req, res) => {
    try {
        const appId = parseInt(process.env.REACT_APP_PUBLIC_ZEGO_APP_ID);
        const serverSecret = process.env.REACT_APP_PUBLIC_ZEGO_SERVER_ID;
        const userId = req.params.userId;
        const effectiveTime = 3600;
        const payload = "";
        if (appId && serverSecret && userId) {
            const token = generateToken04(appId, userId, serverSecret, effectiveTime, payload);
            return res.status(200).json({ token });
        }
        res.status(400).json({ error: "userId, appId and server secret is required!" });
    } catch (error) {
        console.error("Error generating token:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const createAccessToken = (user) => {
    return jwt.sign({ username: user.username, id: user._id }, process.env.JWT_SECRET, { expiresIn: "5h" });
};
export const createAdminAccessToken = (admin) => {
    return jwt.sign({ name: admin }, process.env.JWT_SECRET, { expiresIn: "5h" });
};
