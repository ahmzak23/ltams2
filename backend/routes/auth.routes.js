const express = require('express');
const router = express.Router();
const { register, login, refreshToken, logout } = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

// Protected route example
router.get('/me', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router; 