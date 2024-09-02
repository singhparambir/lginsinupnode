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
