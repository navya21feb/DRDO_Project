const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../controllers/authController');
const { updateProfile } = require('../controllers/userController');

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const { id } = req.user;
    const user = await require('../models/User').findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get profile", error: error.message });
  }
});

// Update user profile
router.put('/update-profile', authenticateToken, updateProfile);

module.exports = router;