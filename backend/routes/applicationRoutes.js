const express = require('express');
const router = express.Router();
const {
  createApplication,
  getAllApplications,
  updateStatus
} = require('../controllers/applicationController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, createApplication);
router.get('/', authMiddleware, getAllApplications);
router.put('/:id/status', authMiddleware, updateStatus);

module.exports = router;
