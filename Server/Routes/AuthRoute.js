
import { Router } from 'express';
import { userVerification } from '../Middlewares/AuthMiddleware.js';
import { Signup, Login, forgotPassword, resetPassword } from '../Controller/AuthController.js';

const router = Router();

router.post('/', userVerification)
router.post('/signup', Signup);
router.post('/login', Login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);


export default router
