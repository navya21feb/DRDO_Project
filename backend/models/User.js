// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  phone: { type: String },
  branch: { type: String },
  cgpa: { type: String },
  year: { type: String },
  university: { type: String },
  location: { type: String },
  department: { type: String }, // Add this field for admin users
  profileCompleted: { type: Boolean, default: false },
  dashboardData: {
    marks: { type: Number, default: 0 },
    attendance: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('User', UserSchema);