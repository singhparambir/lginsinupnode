import User from "../Model/UserModal.js"
import { createSecretToken } from "../Util/SecretToken.js";
import bcrypt from "bcrypt";
import crypto from 'crypto';

// import { sendResetEmail } from "../Util/SendEmail.js";
import * as EmailService from "../Util/emailService.js";


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
export const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found with email:", email);
            return res.status(400).json({ message: 'Incorrect email or password' });
        }

        // Detailed logging
        console.log("Received password:", password);
        console.log("Stored hashed password:", user.password);
        const hashedPassword = await bcrypt.hash(password, 12);


        // bcrypt.compare(password, user.password, (err, data) => {
        //     //if error than throw error
        //     if (err) throw err

        //     //if both match than you can do anything
        //     if (data) {
        //         return res.status(200).json({ msg: "Login success" })
        //     } else {
        //         return res.status(401).json({ msg: "Invalid credencial" })
        //     }

        // });
        const auth = await bcrypt.compare(password, user.password);
        console.log("auth", auth)
        if (!auth) {
            console.log("Password mismatch for user:", email);
            return res.status(400).json({ message: 'Incorrect email or password' });
        }

        const token = createSecretToken(user._id);
        res.cookie("token", token, { withCredentials: true, httpOnly: false });
        console.log("User logged in successfully:", user.email);
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
        user.resetTokenExpiry = Date.now() + 2 * 60 * 10000; //2 mint
        await user.save();

        await EmailService.sendResetEmail(user.email, token);
        res.status(200).json({ message: "Password reset link sent to your email." });
    } catch (error) {
        console.error('Error in forgotPassword:', error); // Add this line for more detailed error logging
        res.status(500).json({ message: "Server error. Try again later." });
    }
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    console.log('token , and password', password, token)
    try {
        // Find the user with the matching reset token and ensure the token hasn't expired
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        // Hash the new password before saving
        const hashedPassword = await bcrypt.hash(password, 12);
        console.log(" password:", password);

        // Update the user's password and clear the reset token and expiry
        user.password = password;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        user.retries = 0;  // Reset retries after a successful password reset
        user.lockUntil = undefined;  // Unlock the account if it was locked

        // Save the updated user object
        await user.save();

        console.log("Password saved successfully:", user.password);

        res.status(200).json({ message: "Password has been reset." });
    } catch (error) {
        console.error('Error in resetPassword:', error); // For better error tracking
        res.status(500).json({ message: "Server error. Try again later." });
    }
};

