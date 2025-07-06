const Application = require('../models/Application');
const path = require('path');
const fs = require('fs');

// Create a new application
exports.createApplication = async (req, res) => {
  try {
    console.log("📥 Request Body:", req.body);
    console.log("📎 Uploaded File:", req.file); // since using upload.single()

    const { position, coverLetter, expectedStartDate } = req.body;

    if (!position || !req.file) {
      return res.status(400).json({ error: "Position and resume are required." });
    }

    const resume = req.file.filename;

    const app = await Application.create({
      student: req.user.id,
      position,
      coverLetter,
      expectedStartDate,
      resume,
      status: "pending"
    });

    res.status(201).json(app);
  } catch (error) {
    console.error("❌ Error creating application:", error);
    res.status(500).json({ error: "Failed to create application." });
  }
};

// Get all applications (Admin view)
exports.getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find()
      .populate({
        path: 'student',
        select: 'name email branch'
      })
      .sort({ submittedAt: -1 })
      .lean();

    const formattedApps = apps.map(app => ({
      _id: app._id,
      studentName: app.student?.name || 'Unknown',
      email: app.student?.email || 'No email',
      branch: app.student?.branch || 'Not specified',
      position: app.position,
      status: app.status,
      dateApplied: app.submittedAt?.toLocaleDateString() || 'N/A',
      resume: app.resume, // ✅ Include resume filename so admin can view/download
      coverLetter: app.coverLetter,
      expectedStartDate: app.expectedStartDate
    }));

    res.status(200).json(formattedApps);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ error: "Failed to fetch applications." });
  }
};


// Update application status (Admin action) - FIXED
exports.updateStatus = async (req, res) => {
  try {
    console.log("📝 Status update request received:");
    console.log("   - App ID:", req.params.id);
    console.log("   - Request Body:", req.body);
    console.log("   - Content-Type:", req.get('Content-Type'));

    // Better error handling for missing status
    if (!req.body || !req.body.status) {
      console.log("❌ Status missing in request body");
      return res.status(400).json({ 
        error: "Status is required in request body",
        received: req.body
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    // Status validation
    const validStatuses = ["pending", "approved", "on hold", "rejected"];
    if (!validStatuses.includes(status)) {
      console.log("❌ Invalid status:", status);
      return res.status(400).json({ 
        error: `Invalid status. Valid values are: ${validStatuses.join(', ')}`,
        received: status
      });
    }

    console.log("✅ Updating application status to:", status);

    const updated = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("student", "name email branch");

    if (!updated) {
      console.log("❌ Application not found:", id);
      return res.status(404).json({ error: "Application not found" });
    }

    console.log("✅ Application updated successfully:", {
      id: updated._id,
      status: updated.status,
      student: updated.student?.name
    });

    // Return consistent format
    res.status(200).json({
      message: "Status updated successfully",
      status: updated.status,
      application: {
        _id: updated._id,
        status: updated.status,
        studentName: updated.student?.name,
        email: updated.student?.email,
        branch: updated.student?.branch,
        position: updated.position
      }
    });
    
  } catch (error) {
    console.error("❌ Status update error:", error);
    res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
};

// Get applications for a specific student (Student dashboard)
exports.getStudentApplications = async (req, res) => {
  try {
    const studentId = req.user.id;

    const apps = await Application.find({ student: studentId })
      .sort({ submittedAt: -1 })
      .lean();

    // Format for student view
    const formattedApps = apps.map(app => ({
      ...app,
      dateApplied: app.submittedAt?.toLocaleDateString(),
      status: app.status,
      resume:app.resume
    }));

    res.status(200).json(formattedApps);
  } catch (error) {
    console.error("Error fetching student's applications:", error);
    res.status(500).json({ error: "Failed to fetch your applications." });
  }
};

// Get single application - MODIFIED
exports.getApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const app = await Application.findById(id)
      .populate("student", "name email branch")
      .lean();

    if (!app) {
      return res.status(404).json({ error: "Application not found." });
    }

    // Format response
    const formattedApp = {
      ...app,
      studentName: app.student?.name,
      email: app.student?.email,
      branch: app.student?.branch,
      status: app.status,
      dateApplied: app.submittedAt?.toLocaleDateString(),
      resume: app.resume
    };

    res.status(200).json(formattedApp);
  } catch (error) {
    console.error("Error fetching application:", error);
    res.status(500).json({ error: "Failed to fetch application." });
  }
};

// Add this new function to serve resume files
exports.getResume = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Resume file not found' });
    }
    
    // Set appropriate headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    
    // Send the file
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving resume:', error);
    res.status(500).json({ error: 'Failed to serve resume file' });
  }
};


exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    // Optionally: check if the application belongs to the logged-in student
    const app = await Application.findById(id);
    if (!app) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (app.student.toString() !== req.user.id) {
      return res.status(403).json({ error: "You are not authorized to delete this application." });
    }

    await Application.findByIdAndDelete(id);

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ error: "Failed to delete application" });
  }
};

