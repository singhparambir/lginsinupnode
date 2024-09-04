import User from "../Model/UserModal.js"
import { createSecretToken } from "../Util/SecretToken.js";
import bcrypt from "bcrypt";
import crypto from 'crypto';


import { sendResetEmail } from "../Util/emailService.js";
// import * as EmailService from "../Util/emailService.js";


export const Signup = async (req, res, next) => {
    try {
        // return res.json({ "data": req.body });

        const { email, password, username } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ message: "User already exists" });
        }
        const user = await User.create({ email, password, username });
        const token = createSecretToken(user._id);
        try {
            res.cookie("token", token, {
                withCredentials: true,
                httpOnly: false,
            });
        }
        catch (cookieError) {
            console.error("Error setting cookie:", cookieError);
        }

        return res.status(200)
            .json({ message: "User added", success: true, user });
        //  use http status 200 for succesful updation of resource - Signup naal 

    } catch (error) {
        console.log(error)
    }
};

const lockoutPeriod = 2 * 60 * 1000; // 2 minutes in milliseconds

// Inside your Login function
export const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Incorrect email or password' });
        }

        const auth = await bcrypt.compare(password, user.password);
        const currentTime = new Date();

        if (!auth) {
            // If password is incorrect, increment failed attempts
            user.failedAttempts.count += 1;
            user.failedAttempts.lastAttempt = currentTime;
            await user.save();

            if (user.failedAttempts.count >= 3) {
                return res.status(403).json({ message: 'Account locked. Try again in 2 minutes.' });
            }

            return res.status(400).json({ message: 'Incorrect email or password' });
        }

        // If password is correct, reset failed attempts and lockout status
        user.failedAttempts.count = 0;
        user.failedAttempts.lastAttempt = currentTime;
        await user.save();

        const token = createSecretToken(user._id);
        res.cookie("token", token, { withCredentials: true, httpOnly: false });
        return res.status(200).json({ message: "User logged in successfully", success: true });

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User with this email does not exist." });
        }

        const token = crypto.randomBytes(32).toString("hex");
        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + (3 * 60 * 1000); // Token expires in 3 minutes
        user.resetTokenStatus = 0; // 0 means token is valid
        await user.save();

        await sendResetEmail(user.email, token); // Sends the reset email with the token
        res.status(200).json({ message: "Password reset link sent to your email." });
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(500).json({ message: "Server error. Try again later." });
    }
};

export const checkTokenValidity = async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }, // Token must not be expired
            resetTokenStatus: 0 // 0 means token is still valid
        });

        if (!user) {
            return res.status(200).json({ valid: false });
        }

        // Just return validity status, don't modify the user object here
        res.status(200).json({ valid: true });
    } catch (error) {
        console.error('Error in checkTokenValidity:', error);
        res.status(500).json({ valid: false });
    }
};
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }, // Token must not be expired
            resetTokenStatus: 0 // 0 means token is still valid
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        user.password = password;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        user.resetTokenStatus = 1; // 1 means token is now expired

        await user.save();

        res.status(200).json({ message: "Password has been reset." });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({ message: "Server error. Try again later." });
    }
};