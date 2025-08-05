import { Prisma, PrismaClient } from '@prisma/client';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

//register user
const registerUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    //basic validation
    if (!email || !name || !password) {
      return res.status(400).json({
        message: 'All fields are required',
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
export { registerUser, loginUser };
