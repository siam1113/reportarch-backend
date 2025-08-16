const express = require('express');
const router = express.Router();
const orgController = require('../controllers/orgController');
const Joi = require('joi');
const validate = require('../middleware/validate');

const orgSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  userId: Joi.string().optional(), // Allow userId for automatic user assignment
});

router.post('/', validate(orgSchema), orgController.createOrg);
router.get('/user/:userId', orgController.listOrgsForUser);
router.get('/:id', orgController.getOrg);
router.put('/:id', validate(orgSchema), orgController.updateOrg);
router.delete('/:id', orgController.deleteOrg);
router.get('/:id/users', orgController.listUsersForOrg);

module.exports = router;
