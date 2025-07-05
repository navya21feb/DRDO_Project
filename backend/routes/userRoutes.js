const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../controllers/authController');
const { updateProfile } = require('../controllers/userController');

router.put('/update-profile', authenticateToken, updateProfile);

module.exports = router;
