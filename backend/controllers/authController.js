const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ name, email, password: hashedPassword, role });
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
  
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { 
    expiresIn: "7d" 
  });
  
  // Return user without password
  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };
  
  res.json({ token, user: userResponse });
};

// NEW: Token verification endpoint
exports.verifyToken = async (req, res) => {
  try {
    // The user info is already available from the auth middleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ 
      valid: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Auth middleware function
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
};


