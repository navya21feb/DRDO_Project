const User = require('../models/User');

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.user; // coming from token
    const updates = req.body;

    // Validate required fields
    const requiredFields = ['name', 'email', 'university', 'branch', 'year'];
    const missingFields = requiredFields.filter(field => !updates[field]?.trim());
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updates.email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Validate CGPA if provided
    if (updates.cgpa && (parseFloat(updates.cgpa) < 0 || parseFloat(updates.cgpa) > 10)) {
      return res.status(400).json({
        success: false,
        message: 'CGPA must be between 0 and 10'
      });
    }

    // Validate year field
    const validYears = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'];
    if (!validYears.includes(updates.year)) {
      return res.status(400).json({
        success: false,
        message: 'Please select a valid year'
      });
    }

    // Check if email is being changed and if it's already taken by another user
    if (updates.email) {
      const existingUser = await User.findOne({ 
        email: updates.email, 
        _id: { $ne: id } 
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email is already registered with another account'
        });
      }
    }

    // Remove any fields that shouldn't be updated directly
    const allowedUpdates = [
      'name', 'email', 'phone', 'branch', 'cgpa', 'year', 
      'university', 'location', 'profileCompleted'
    ];
    
    const filteredUpdates = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    // Set profileCompleted to true if all required fields are provided
    filteredUpdates.profileCompleted = requiredFields.every(field => 
      filteredUpdates[field]?.trim()
    );

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      filteredUpdates, 
      {
        new: true,
        runValidators: true
      }
    ).select('-password'); // Exclude password from response

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    
    // Handle duplicate key error (email already exists)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered with another account'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: validationErrors.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.user; // coming from token
    const updates = req.body;

    // Remove sensitive fields that shouldn't be updated
    delete updates.password;
    delete updates.role;

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    }).select('-password'); // Don't return password

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to update profile", 
      error: error.message 
    });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const { id } = req.user;
    
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: user
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
};