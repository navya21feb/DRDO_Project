const User = require('../models/User');

exports.updateProfile = async (req, res) => {
  try {
    // Prepare the update fields safely
    const updateData = {
      ...req.body,
      profileCompleted: true, // ✅ Always mark profile as completed when updating
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).select('-password'); // Exclude password

    res.json({ updatedUser, message: "Profile updated and marked as completed!" });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};
