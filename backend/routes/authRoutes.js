const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Adjust path as needed

// Existing routes
router.post('/signup', authController.register);
router.post('/login', authController.login);

// NEW: Token verification route
router.get('/verify', authController.authenticateToken, authController.verifyToken);

module.exports = router;