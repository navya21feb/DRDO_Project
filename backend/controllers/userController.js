const User = require('../models/User');

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.user; // coming from token
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    });

    res.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update profile", error });
  }
};
