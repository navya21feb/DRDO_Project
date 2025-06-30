const Application = require('../models/Application');
exports.createApplication = async (req, res) => {
 const app = await Application.create({ ...req.body, student: req.user.id });
 res.status(201).json(app);
};
exports.getAllApplications = async (req, res) => {
 const apps = await Application.find().populate('student', 'name email');
 res.json(apps);
};
exports.updateStatus = async (req, res) => {
 const { id } = req.params;
 const { status } = req.body;
 const updated = await Application.findByIdAndUpdate(id, { status }, { new: true });
 res.json(updated);
};
