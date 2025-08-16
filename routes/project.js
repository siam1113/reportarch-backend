const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const Joi = require('joi');
const validate = require('../middleware/validate');

const projectSchema = Joi.object({
  name: Joi.string().required(),
  orgId: Joi.string().required(),
  description: Joi.string().allow(''),
  userId: Joi.string().optional(), // Allow userId for automatic user assignment
});

router.post('/', validate(projectSchema), projectController.createProject);
router.get('/', projectController.listProjects);
router.get('/:id', projectController.getProject);
router.put('/:id', validate(projectSchema), projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

module.exports = router;
