const express = require('express');
const { register, login, logout, getMe } = require('../controllers/auth.controller');
const protectRoute = require('../middleware/protectRoute');

/**
 * Authentication Routes
 */
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protectRoute, getMe);

module.exports = router;
