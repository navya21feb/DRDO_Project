// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  profileCompleted: { type: Boolean, default: false },
  dashboardData: {
    marks: { type: Number, default: 0 },
    attendance: { type: Number, default: 0 }
    // add more fields as needed
  }
});

module.exports = mongoose.model('User', UserSchema);
