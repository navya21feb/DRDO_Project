const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Main auth routes
router.post('/signup', authController.register);
router.post('/login', authController.login);
router.get('/verify', authController.authenticateToken, authController.verifyToken);

module.exports = router;