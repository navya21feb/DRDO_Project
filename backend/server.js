const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB connected successfully"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// Middleware
app.use(cors());

// Conditional body parsing middleware
const conditionalJsonParser = (req, res, next) => {
  // Only parse JSON for specific routes that need it
  if (req.path.includes('/status') || req.method === 'PUT' || req.method === 'PATCH') {
    return express.json()(req, res, next);
  }
  next();
};


// Routes
const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

// For /auth routes (they use JSON)
app.use('/api/auth', express.json(), authRoutes);

// For /applications routes (conditional parsing)
app.use('/api/applications', conditionalJsonParser, applicationRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("🚀 DRDO Internship Backend is running successfully!");
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server Error:', error);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Routes available:`);
  console.log(`   POST http://localhost:${PORT}/api/auth/signup`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
  console.log(`   GET  http://localhost:${PORT}/api/applications`);
  console.log(`   GET  http://localhost:${PORT}/api/applications/student/mine`);
  console.log(`   POST http://localhost:${PORT}/api/applications`);
  console.log(`   GET  http://localhost:${PORT}/api/applications/:id`);
  console.log(`   GET  http://localhost:${PORT}/api/applications/resume/:filename`);
  console.log(`   PUT  http://localhost:${PORT}/api/applications/:id/status`);
});
