const express = require('express');
const router = express.Router();
const {
  createApplication,
  getAllApplications,
  getApplication,
  updateStatus,
  getStudentApplications,
  getResume,
  deleteApplication 
} = require('../controllers/applicationController');

const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multer');

// ✅ Application Creation - now accepts ONLY 1 resume
router.post('/', upload.single('resume'), authMiddleware, createApplication);

// Admin Routes
router.get('/', authMiddleware, getAllApplications);
router.get('/:id', authMiddleware, getApplication);
router.put('/:id/status', authMiddleware, updateStatus);

// Student Routes
router.get('/student/mine', authMiddleware, getStudentApplications);
router.delete('/:id', authMiddleware, deleteApplication);

// ✅ Serve uploaded resume
router.get('/resume/:filename', getResume);

module.exports = router;
