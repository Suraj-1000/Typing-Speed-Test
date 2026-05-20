const prisma = require('../utils/prisma');

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

    // Update user xp and level based on score
    const xpGained = Math.round(netWpm * (accuracy / 100));
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { xp: true }
    });

    const newXp = (user?.xp || 0) + xpGained;
    // Each level requires 1000 XP (e.g. Level 1: 0-999 XP, Level 2: 1000-1999 XP, etc.)
    const newLevel = Math.floor(newXp / 1000) + 1;

    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: newXp,
        level: newLevel
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
