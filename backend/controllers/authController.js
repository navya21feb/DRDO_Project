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
 const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn:
"7d" });
 res.json({ token, user });
};

