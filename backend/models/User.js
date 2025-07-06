// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
  },
  password: { 
    type: String, 
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: { 
    type: String, 
    enum: ['student', 'admin'], 
    default: 'student' 
  },
  phone: { 
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // Allow empty string or valid phone number
        return !v || /^[0-9]{10}$/.test(v);
      },
      message: 'Phone number must be 10 digits'
    }
  },
  branch: { 
    type: String,
    trim: true,
    maxlength: [100, 'Branch name cannot exceed 100 characters']
  },
  cgpa: { 
    type: String,
    validate: {
      validator: function(v) {
        // Allow empty string or valid CGPA
        return !v || (parseFloat(v) >= 0 && parseFloat(v) <= 10);
      },
      message: 'CGPA must be between 0 and 10'
    }
  },
  year: { 
    type: String,
    enum: {
      values: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'],
      message: 'Please select a valid year'
    }
  },
  university: { 
    type: String,
    trim: true,
    maxlength: [200, 'University name cannot exceed 200 characters']
  },
  location: { 
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  profileCompleted: { 
    type: Boolean, 
    default: false 
  },
  dashboardData: {
    marks: { type: Number, default: 0 },
    attendance: { type: Number, default: 0 }
  },
  // Add timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
UserSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

// Virtual for full profile completion check
UserSchema.virtual('isProfileComplete').get(function() {
  const requiredFields = ['name', 'email', 'university', 'branch', 'year'];
  return requiredFields.every(field => this[field] && this[field].trim());
});

// Ensure virtual fields are serialized
UserSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model('User', UserSchema);