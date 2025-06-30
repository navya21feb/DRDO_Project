const Application = require('../models/Application');

exports.createApplication = async (req, res) => {
  try {
    const app = await Application.create({ ...req.body, student: req.user.id });
    res.status(201).json(app);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create application' });
  }
};

exports.getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find().populate('student', 'name email');
    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await Application.findByIdAndUpdate(id, { status }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};