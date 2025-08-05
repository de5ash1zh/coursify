import express from 'express';
import { registerUser, loginUser, refreshToken, forgotPassword, resetPassword } from '../controllers/user.controller.js';
import authenticate from '../middlewares/auth.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: {
    message: 'Too many login attempts from this IP, please try again after 15 minutes.'
  }
});

router.post('/register', registerUser);
router.post('/login', loginLimiter, loginUser);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/me', authenticate, (req, res) => {
  res.json({ message: 'You are authenticated!', user: req.user });
});

export default router;
