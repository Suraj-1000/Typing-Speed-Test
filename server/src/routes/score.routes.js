const express = require('express');
const { saveScore, getHistory } = require('../controllers/score.controller');
const protectRoute = require('../middleware/protectRoute');

const router = express.Router();
// Score related routes

router.post('/', protectRoute, saveScore);
router.get('/history', protectRoute, getHistory);

module.exports = router;
