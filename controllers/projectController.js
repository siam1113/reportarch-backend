const Project = require('../models/project');
const User = require('../models/user');

exports.createProject = async (req, res) => {
  try {
    const { userId, ...projectData } = req.body;
    
    // Create the project
    const project = await Project.create(projectData);
    
    // If userId is provided, add the project to the user's projects array
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        // Add project to user's projects array
        user.projects.push(project._id);
        await user.save();
        
        // Add user to project's users array
        project.users.push(userId);
        await project.save();
      }
    }
    
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// List all projects or filter by orgId
exports.listProjects = async (req, res) => {
  try {
    const { orgId } = req.query;
    let filter = {};
    
    if (orgId) {
      filter.orgId = orgId;
    }
    
    const projects = await Project.find(filter).populate('orgId', 'name').sort({ createdAt: -1 });
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ error: 'Failed to list projects' });
  }
};

exports.createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
