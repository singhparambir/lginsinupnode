import { Router } from 'express';
import { userVerification } from '../Middlewares/AuthMiddleware.js';
import { Signup, Login, forgotPassword, resetPassword } from '../Controller/AuthController.js';

const router = Router();

router.post('/', userVerification);
router.post('/signup', Signup);
router.post('/login', Login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Add this route for token verification
router.get('/verify-token/:token', async (req, res) => {
    const { token } = req.params;
    try {
        const user = await user.findOne({
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
