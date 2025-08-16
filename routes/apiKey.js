const express = require('express');
const router = express.Router();
const apiKeyController = require('../controllers/apiKeyController');

// Routes that match frontend expectations
router.post('/', apiKeyController.createApiKey);           // POST /api/apikey
router.get('/', apiKeyController.listApiKeys);             // GET /api/apikey  
router.delete('/:id', apiKeyController.deleteApiKey);      // DELETE /api/apikey/:id

// Keep legacy routes for backward compatibility
router.post('/create', apiKeyController.createApiKey);
router.post('/revoke/:key', apiKeyController.revokeApiKey);
router.get('/list', apiKeyController.listApiKeys);

module.exports = router;
