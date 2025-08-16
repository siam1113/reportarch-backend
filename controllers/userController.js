const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing required fields' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const update = { name, email, role };
    if (password) update.password = await bcrypt.hash(password, 10);
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};


exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list users' });
  }
};

// List orgs and projects for a user
exports.listOrgsProjectsForUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('orgs').populate('projects').select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ orgs: user.orgs, projects: user.projects });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list orgs/projects for user' });
  }
};
