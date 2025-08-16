const ApiKey = require('../models/apiKey');

module.exports = async function verifyApiKey(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'API key missing or invalid' });
    }
    const key = authHeader.replace('Bearer ', '').trim();
    const apiKey = await ApiKey.findOne({ key, status: 'active' });
    if (!apiKey) {
      return res.status(403).json({ error: 'API key invalid or revoked' });
    }
    req.apiKey = apiKey;
    next();
  } catch (err) {
    res.status(500).json({ error: 'API key verification failed' });
  }
};
