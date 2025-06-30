 const mongoose = require('mongoose');
 const applicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  position: String,
  coverLetter: String,
  expectedStartDate: String,
  documents: [String],
  status: { type: String, enum: ['pending', 'approved', 'hold', 'rejected'], default: 'pending' 
},
  submittedAt: { type: Date, default: Date.now }
 });
 module.exports = mongoose.model('Application', applicationSchema);