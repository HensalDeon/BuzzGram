import UserModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import { hashPassword } from "../config/security.js";
import { sendOtp, verifyOtp } from "../config/twilio.js";
import jwt from "jsonwebtoken";

// Registering a new User
export const registerUser = async (req, res) => {
    try {
        const { fullname, username, password, phone } = req.body;
        console.log(username, "😁😁");

        const existingUsername = await UserModel.findOne({ username }).exec();
        if (existingUsername) {
            return res.status(400).send({ error: "Please use a unique username" });
        }

        const hashedPass = await hashPassword(password);

        const newUser = new UserModel({
            fullname,
            username,
            password: hashedPass,
            phone,
        });
        await newUser.save();
        res.status(200).json({ message: "user registerd succesfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// login User

export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username }).exec();
        if (!user) {
            return res.status(404).send({ error: "Username not Found" });
        }
        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            return res.status(400).send({ error: "Password does not Match" });
        }
        // Create a JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );
        delete user.password;
        return res.status(200).send({
            message: "Login Successful...!",
            user,
            token,
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).send({ error: "Internal Server Error" });
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
        const isVerified = await verifyOtp(phoneNumber, otp);
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

export const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
    });
};

export const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "30d",
    });
};
