import { Prisma, PrismaClient } from '@prisma/client';

import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
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

export default registerUser;
