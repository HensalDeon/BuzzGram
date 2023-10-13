import UserModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import { hashPassword } from "../config/security.js";
import { sendOtp, verifyOtp } from "../config/twilio.js";
import jwt from "jsonwebtoken";

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

export const createAccessToken = (user) => {
    return jwt.sign({ username: user.username, id: user._id }, process.env.JWT_SECRET, { expiresIn: "5h" });
};
export const createAdminAccessToken = (admin) => {
    return jwt.sign({ name: admin }, process.env.JWT_SECRET, { expiresIn: "5h" });
};
