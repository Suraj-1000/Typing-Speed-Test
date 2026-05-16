const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({ accelerateUrl: process.env.DATABASE_URL });

/**
 * Save user typing score
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const saveScore = async (req, res) => {
  try {
    const { mode, duration, rawWpm, netWpm, accuracy, errors } = req.body;
    const userId = req.user.id;

    if (rawWpm === undefined || netWpm === undefined || accuracy === undefined) {
      return res.status(400).json({ error: 'Missing required score fields' });
    }

    const newResult = await prisma.typingResult.create({
      data: {
        mode: mode || 'time',
        duration: duration || 60,
        rawWpm,
        netWpm,
        accuracy,
        errors: errors || 0,
        userId
      }
    });

    // Optional: update user xp and level based on score
    const xpGained = Math.round(netWpm * (accuracy / 100));
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: { increment: xpGained }
      }
    });

    res.status(201).json(newResult);
  } catch (error) {
    console.error('Error in saveScore controller', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Get user typing history
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const history = await prisma.typingResult.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    res.status(200).json(history);
  } catch (error) {
    console.error('Error in getHistory controller', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  saveScore,
  getHistory
};
