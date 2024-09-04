import { Router } from 'express';
import { userVerification } from '../Middlewares/AuthMiddleware.js';
import { Signup, Login, forgotPassword, resetPassword } from '../Controller/AuthController.js';
import { checkLoginAttempts } from '../Middlewares/AuthMiddleware.js'; // New middleware for lockout feature

const router = Router();

router.post('/', userVerification);
router.post('/signup', Signup);

// Apply the checkLoginAttempts middleware before the Login handler
router.post('/login', checkLoginAttempts, Login);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Add this route for token verification
router.get('/verify-token/:token', async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ message: 'Token expired or invalid' });
        }
        res.status(200).json({ message: 'Token is valid' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
