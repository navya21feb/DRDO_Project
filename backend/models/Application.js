const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  coverLetter: {
    type: String,
  },
  expectedStartDate: {
    type: String,
  },
  resume: {
    type: String, // Store the filename of the uploaded resume
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "on hold", "rejected"],
    default: "pending",
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Application", applicationSchema);
