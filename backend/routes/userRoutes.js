const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../controllers/authController');
const { updateProfile, getProfile } = require('../controllers/userController');

// Get current user profile
router.get('/profile', authenticateToken, getProfile);

// Update user profile
router.put('/update-profile', authenticateToken, updateProfile);

module.exports = router;