const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const generateToken = require('../utils/generateToken');

const prisma = new PrismaClient();

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      }
    });

    if (newUser) {
      generateToken(newUser.id, res);

      res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        xp: newUser.xp,
        level: newUser.level
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error in register controller', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Authenticate and login user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { username }
    });

    const isPasswordCorrect = await bcrypt.compare(password, user?.password || '');

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    generateToken(user.id, res);

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      xp: user.xp,
      level: user.level,
      avatar: user.avatar
    });
  } catch (error) {
    console.error('Error in login controller', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Logout user by clearing cookies
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const logout = (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error in logout controller', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        xp: true,
        level: true,
        streak: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getMe controller', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe
};
