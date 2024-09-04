import User from '../Model/UserModal.js'; // Ensure this path is correct;
import jwt from 'jsonwebtoken';
const { verify } = jwt;

import 'dotenv/config';

export function userVerification(req, res) {

    const token = req.cookies.token;

    if (!token) {
        return res.json({ status: false });
    }

    verify(token, process.env.TOKEN_KEY, async (err, decoded) => {
        if (err) {
            return res.json({ status: false });
        } else {
            try {
                // Fetch user by ID using the User model
                const user = await User.findById(decoded.id); // Ensure this is the correct field
                if (user) {
                    return res.json({ status: true, user: user.username });
                } else {
                    return res.json({ status: false });
                }
            } catch (error) {
                console.error('Error finding user:', error);
                return res.json({ status: false });

            }
        }
    });
}


export const checkLoginAttempts = async (req, res, next) => {
    const { email } = req.body;
    const currentTime = new Date();

    try {
        const user = await User.findOne({ email });

        if (user) {
            const { failedAttempts } = user;

            if (failedAttempts.count >= 3 && (currentTime - new Date(failedAttempts.lastAttempt)) < lockoutPeriod) {
                const timeLeft = Math.ceil((lockoutPeriod - (currentTime - new Date(failedAttempts.lastAttempt))) / 60000);
                return res.status(403).json({ message: `Account locked. Try again in ${timeLeft} minutes.` });
            } else if (failedAttempts.count >= 3) {
                // Reset attempts if lockout period has expired
                user.failedAttempts.count = 0;
                user.failedAttempts.lastAttempt = currentTime;
                await user.save();
            }
        }

        next();
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}
