import express from 'express';
import { registerUser, loginUser } from '../controllers/user.controller.js';
import authenticate from '../middlewares/auth.js';

const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/me', authenticate, (req, res) => {
  res.json({ message: 'You are authenticated!', user: req.user });
});

export default router;
