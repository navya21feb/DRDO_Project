const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER a new user
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ message: "User created" });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(400).json({ error: "Email already exists" });
  }
};

// LOGIN controller
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Create a clean user object (exclude password)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      branch: user.branch,
      cgpa: user.cgpa,
      year: user.year,
      university: user.university,
      location: user.location,
    };

    // ✅ Return token + user
    res.json({ token, user: userData });

  } catch (err) {
    console.error("Login Error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Server error" });
    }
  }
};

// VERIFY TOKEN controller
exports.verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      branch: user.branch,
      cgpa: user.cgpa,
      year: user.year,
      university: user.university,
      location: user.location,
    };

    // Optional: Return token again (if frontend refresh is designed to update token)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ valid: true, user: userData, token });

  } catch (error) {
    console.error("Verify Token Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Server error" });
    }
  }
};

// AUTHENTICATE middleware
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = decoded;
    next();
  });
};

// UPDATE PROFILE controller
exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true, select: "-password" }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
