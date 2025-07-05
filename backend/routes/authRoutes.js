const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); 
const { register, login, verifyToken, authenticateToken } = require('../controllers/authController');
const { updateProfile } = require('../controllers/userController');

// Existing routes
router.post('/signup', authController.register);
router.post('/login', authController.login);
router.get('/verify', authController.authenticateToken, authController.verifyToken);


module.exports = router;