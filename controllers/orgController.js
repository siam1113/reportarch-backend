const Org = require('../models/org');
const User = require('../models/user');

exports.createOrg = async (req, res) => {
  try {
    const { userId, ...orgData } = req.body;
    
    // Create the organization
    const org = await Org.create(orgData);
    
    // If userId is provided, add the user to the organization and vice versa
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        // Add user to organization's users array
        org.users.push(userId);
        await org.save();
        
        // Add organization to user's orgs array
        user.orgs.push(org._id);
        await user.save();
      }
    }
    
    res.status(201).json(org);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOrg = async (req, res) => {
  try {
    const org = await Org.findById(req.params.id);
    if (!org) return res.status(404).json({ error: 'Org not found' });
    res.json(org);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateOrg = async (req, res) => {
  try {
    const org = await Org.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!org) return res.status(404).json({ error: 'Org not found' });
    res.json(org);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.deleteOrg = async (req, res) => {
  try {
    const org = await Org.findByIdAndDelete(req.params.id);
    if (!org) return res.status(404).json({ error: 'Org not found' });
    res.json({ message: 'Org deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// List users for an org
exports.listUsersForOrg = async (req, res) => {
  try {
    const org = await Org.findById(req.params.id).populate('users');
    if (!org) return res.status(404).json({ error: 'Org not found' });
    res.json({ users: org.users });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list users for org' });
  }
};

// List organizations for a user
exports.listOrgsForUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('orgs');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ organizations: user.orgs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list organizations for user' });
  }
};
