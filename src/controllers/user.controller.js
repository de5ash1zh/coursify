import { Prisma, PrismaClient } from '@prisma/client';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

//register user
const registerUser = async (req, res) => {
  try {
    const { email, name, password, role } = req.body;

    //basic validation
    if (!email || !name || !password) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }
    // Password validation
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long and contain at least one special character (!@#$%^&*)',
      });
    }

    //check if user already exists

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(409).json({
        message: 'user already exists',
      });
    }

    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    //Save user to DB
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'STUDENT',
      },
    });

    return res.status(200).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

//login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validate the input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password is required' });
    }

    //Find user by email
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    //if user not found
    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    //compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid Credentials',
      });
    }

    //Generate token for the user
    const token = jwt.sign({ userId: user.id, role: user.role || 'user' }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({
      message: 'login success',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role || 'user',
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      message: 'Internal Server error',
    });
  }
};

// Helper to generate tokens
function generateTokens(user) {
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role || 'user' },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { userId: user.id, role: user.role || 'user' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
}

// Refresh token endpoint
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token required' });
  }
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) return res.status(401).json({ message: 'Invalid refresh token' });
    const tokens = generateTokens(user);
    res.json(tokens);
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

// Forgot password endpoint
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ message: 'User not found' });
  const resetToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  // Here you would send the resetToken via email. For now, return it for testing.
  res.json({ message: 'Password reset token generated', resetToken });
};

// Reset password endpoint
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ message: 'Token and new password required' });
  if (!passwordRegex.test(newPassword)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long and contain at least one special character (!@#$%^&*)',
    });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: payload.userId },
      data: { password: hashedPassword },
    });
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

export { registerUser, loginUser, refreshToken, forgotPassword, resetPassword };
