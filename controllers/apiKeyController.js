const ApiKey = require('../models/apiKey');

exports.createApiKey = async (req, res) => {
  try {
    const { name, projectId } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'API key name is required' });
    }
    
    if (!projectId) {
      return res.status(400).json({ error: 'Project ID required' });
    }
    
    const key = ApiKey.generateKey();
    const apiKey = await ApiKey.create({ 
      key, 
      name: name.trim(), 
      projectId,
      createdAt: new Date(),
      status: 'active'
    });
    
    // Return the full API key object that frontend expects
    res.status(201).json({
      _id: apiKey._id,
      name: apiKey.name,
      key: apiKey.key,
      projectId: apiKey.projectId,
      createdAt: apiKey.createdAt,
      status: apiKey.status
    });
  } catch (err) {
    console.error('Error creating API key:', err);
    res.status(500).json({ error: 'Failed to create API key' });
  }
};

exports.deleteApiKey = async (req, res) => {
  try {
    const { id } = req.params;
    
    const apiKey = await ApiKey.findByIdAndDelete(id);
    if (!apiKey) {
      return res.status(404).json({ error: 'API key not found' });
    }
    
    res.json({ message: 'API key deleted successfully' });
  } catch (err) {
    console.error('Error deleting API key:', err);
    res.status(500).json({ error: 'Failed to delete API key' });
  }
};

exports.revokeApiKey = async (req, res) => {
  try {
    const { key } = req.params;
    const apiKey = await ApiKey.findOneAndUpdate({ key }, { status: 'revoked' }, { new: true });
    if (!apiKey) return res.status(404).json({ error: 'API key not found' });
    res.json({ message: 'API key revoked' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to revoke API key' });
  }
};

exports.listApiKeys = async (req, res) => {
  try {
    const { projectId } = req.query;
    
    let query = { status: { $ne: 'revoked' } }; // Don't show revoked keys
    if (projectId) {
      query.projectId = projectId;
    }
    
    const keys = await ApiKey.find(query).sort({ createdAt: -1 });
    
    // Return in the format frontend expects
    res.json({
      apiKeys: keys.map(key => ({
        _id: key._id,
        name: key.name,
        key: key.key,
        projectId: key.projectId,
        createdAt: key.createdAt,
        lastUsed: key.lastUsed,
        status: key.status
      }))
    });
  } catch (err) {
    console.error('Error listing API keys:', err);
    res.status(500).json({ error: 'Failed to list API keys' });
  }
};
