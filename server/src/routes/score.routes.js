const express = require('express');
const { saveScore, getHistory } = require('../controllers/score.controller');
const protectRoute = require('../middleware/protectRoute');

const router = express.Router();

router.post('/', protectRoute, saveScore);
router.get('/history', protectRoute, getHistory);

module.exports = router;
